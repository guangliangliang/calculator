import { formatDateTime } from '@/utils/formatter.js'

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256)

  for (let index = 0; index < 256; index += 1) {
    let current = index

    for (let bit = 0; bit < 8; bit += 1) {
      current = (current & 1) ? (0xEDB88320 ^ (current >>> 1)) : (current >>> 1)
    }

    table[index] = current >>> 0
  }

  return table
})()

function getEncoder() {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder()
  return null
}

function encodeUtf8Fallback(content) {
  const bytes = []
  const text = String(content)

  for (let index = 0; index < text.length; index += 1) {
    let codePoint = text.charCodeAt(index)

    if (codePoint >= 0xD800 && codePoint <= 0xDBFF && index + 1 < text.length) {
      const next = text.charCodeAt(index + 1)
      if (next >= 0xDC00 && next <= 0xDFFF) {
        codePoint = 0x10000 + ((codePoint - 0xD800) << 10) + (next - 0xDC00)
        index += 1
      }
    }

    if (codePoint <= 0x7F) {
      bytes.push(codePoint)
    } else if (codePoint <= 0x7FF) {
      bytes.push(
        0xC0 | (codePoint >> 6),
        0x80 | (codePoint & 0x3F)
      )
    } else if (codePoint <= 0xFFFF) {
      bytes.push(
        0xE0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3F),
        0x80 | (codePoint & 0x3F)
      )
    } else {
      bytes.push(
        0xF0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3F),
        0x80 | ((codePoint >> 6) & 0x3F),
        0x80 | (codePoint & 0x3F)
      )
    }
  }

  return new Uint8Array(bytes)
}

function encodeText(content) {
  const encoder = getEncoder()
  return encoder ? encoder.encode(content) : encodeUtf8Fallback(content)
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getColumnName(index) {
  let current = index + 1
  let name = ''

  while (current > 0) {
    const remainder = (current - 1) % 26
    name = String.fromCharCode(65 + remainder) + name
    current = Math.floor((current - 1) / 26)
  }

  return name
}

function createSharedStrings(rows) {
  const map = new Map()
  const strings = []

  rows.forEach(row => {
    row.forEach(cell => {
      if (typeof cell === 'string' && !map.has(cell)) {
        map.set(cell, strings.length)
        strings.push(cell)
      }
    })
  })

  return { map, strings }
}

function buildSheetXml(rows, sharedStringMap) {
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((cell, cellIndex) => {
      if (cell === null || cell === undefined || cell === '') return ''

      const cellRef = `${getColumnName(cellIndex)}${rowIndex + 1}`

      if (typeof cell === 'number' && Number.isFinite(cell)) {
        return `<c r="${cellRef}"><v>${cell}</v></c>`
      }

      const sharedIndex = sharedStringMap.get(String(cell))
      return `<c r="${cellRef}" t="s"><v>${sharedIndex}</v></c>`
    }).filter(Boolean).join('')

    return `<row r="${rowIndex + 1}">${cells}</row>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/>
    <col min="2" max="5" width="18" customWidth="1"/>
  </cols>
  <sheetData>${sheetRows}</sheetData>
</worksheet>`
}

function buildSharedStringsXml(strings) {
  const items = strings.map(item => `<si><t>${escapeXml(item)}</t></si>`).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">
  ${items}
</sst>`
}

function crc32(bytes) {
  let crc = 0xFFFFFFFF

  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xFF] ^ (crc >>> 8)
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

function writeUInt16(view, offset, value) {
  view.setUint16(offset, value, true)
}

function writeUInt32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true)
}

function getDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear())
  const dosTime = ((date.getHours() & 0x1F) << 11) |
    ((date.getMinutes() & 0x3F) << 5) |
    Math.floor(date.getSeconds() / 2)
  const dosDate = (((year - 1980) & 0x7F) << 9) |
    (((date.getMonth() + 1) & 0x0F) << 5) |
    (date.getDate() & 0x1F)

  return { dosDate, dosTime }
}

function createZip(files) {
  const localParts = []
  const centralParts = []
  let offset = 0
  const now = getDosDateTime()

  files.forEach(file => {
    const nameBytes = encodeText(file.name)
    const dataBytes = encodeText(file.content)
    const crc = crc32(dataBytes)

    const localHeader = new ArrayBuffer(30)
    const localView = new DataView(localHeader)
    writeUInt32(localView, 0, 0x04034B50)
    writeUInt16(localView, 4, 20)
    writeUInt16(localView, 6, 0)
    writeUInt16(localView, 8, 0)
    writeUInt16(localView, 10, now.dosTime)
    writeUInt16(localView, 12, now.dosDate)
    writeUInt32(localView, 14, crc)
    writeUInt32(localView, 18, dataBytes.length)
    writeUInt32(localView, 22, dataBytes.length)
    writeUInt16(localView, 26, nameBytes.length)
    writeUInt16(localView, 28, 0)

    const centralHeader = new ArrayBuffer(46)
    const centralView = new DataView(centralHeader)
    writeUInt32(centralView, 0, 0x02014B50)
    writeUInt16(centralView, 4, 20)
    writeUInt16(centralView, 6, 20)
    writeUInt16(centralView, 8, 0)
    writeUInt16(centralView, 10, 0)
    writeUInt16(centralView, 12, now.dosTime)
    writeUInt16(centralView, 14, now.dosDate)
    writeUInt32(centralView, 16, crc)
    writeUInt32(centralView, 20, dataBytes.length)
    writeUInt32(centralView, 24, dataBytes.length)
    writeUInt16(centralView, 28, nameBytes.length)
    writeUInt16(centralView, 30, 0)
    writeUInt16(centralView, 32, 0)
    writeUInt16(centralView, 34, 0)
    writeUInt16(centralView, 36, 0)
    writeUInt32(centralView, 38, 0)
    writeUInt32(centralView, 42, offset)

    localParts.push(new Uint8Array(localHeader), nameBytes, dataBytes)
    centralParts.push(new Uint8Array(centralHeader), nameBytes)

    offset += localHeader.byteLength + nameBytes.length + dataBytes.length
  })

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0)
  const endHeader = new ArrayBuffer(22)
  const endView = new DataView(endHeader)
  writeUInt32(endView, 0, 0x06054B50)
  writeUInt16(endView, 4, 0)
  writeUInt16(endView, 6, 0)
  writeUInt16(endView, 8, files.length)
  writeUInt16(endView, 10, files.length)
  writeUInt32(endView, 12, centralSize)
  writeUInt32(endView, 16, offset)
  writeUInt16(endView, 20, 0)

  const totalLength = offset + centralSize + endHeader.byteLength
  const output = new Uint8Array(totalLength)
  let pointer = 0

  ;[...localParts, ...centralParts, new Uint8Array(endHeader)].forEach(part => {
    output.set(part, pointer)
    pointer += part.length
  })

  return output.buffer
}

function buildWorkbookRows(detail) {
  const { calculatorName, results } = detail
  const rows = [
    [`${calculatorName}还款明细`],
    ['导出时间', formatDateTime()],
    ['还款期数', results.months],
    ['还款总额(元)', Number(results.totalPayment?.toFixed?.(2) || results.totalPayment || 0)],
    ['总利息/手续费(元)', Number(
      results.totalInterest?.toFixed?.(2) ||
      results.totalFee?.toFixed?.(2) ||
      results.totalInterest ||
      results.totalFee ||
      0
    )]
  ]

  if (results.repaymentMode) {
    rows.push(['还款方式', results.repaymentMode === 'equal-principal' ? '等额本金' : '等额本息'])
  }

  if (results.downPayment !== undefined) {
    rows.push(['首付金额(元)', Number(results.downPayment?.toFixed?.(2) || results.downPayment || 0)])
  }

  if (results.loanAmount !== undefined) {
    rows.push(['贷款金额(元)', Number(results.loanAmount?.toFixed?.(2) || results.loanAmount || 0)])
  }

  if (results.monthlyFee !== undefined) {
    rows.push(['每期手续费(元)', Number(results.monthlyFee?.toFixed?.(2) || results.monthlyFee || 0)])
  }

  rows.push([])
  rows.push([
    '期数',
    results.monthlyFee !== undefined ? '每期还款(元)' : '月供(元)',
    '本金(元)',
    results.monthlyFee !== undefined ? '手续费(元)' : '利息(元)',
    '剩余本金(元)'
  ])

  results.schedule.forEach(item => {
    rows.push([
      `第${item.period}期`,
      Number(item.payment.toFixed(2)),
      Number(item.principal.toFixed(2)),
      Number(item.interest.toFixed(2)),
      Number(item.remainingPrincipal.toFixed(2))
    ])
  })

  return rows
}

export function buildScheduleXlsx(detail) {
  const rows = buildWorkbookRows(detail)
  const { map, strings } = createSharedStrings(rows)
  const sheetXml = buildSheetXml(rows, map)
  const sharedStringsXml = buildSharedStringsXml(strings)

  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="还款明细" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`
    },
    {
      name: 'xl/styles.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1">
    <font>
      <sz val="11"/>
      <name val="Calibri"/>
    </font>
  </fonts>
  <fills count="1">
    <fill>
      <patternFill patternType="none"/>
    </fill>
  </fills>
  <borders count="1">
    <border/>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`
    },
    {
      name: 'xl/sharedStrings.xml',
      content: sharedStringsXml
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      content: sheetXml
    }
  ]

  return createZip(files)
}

function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '-')
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

export function buildScheduleFileName(calculatorName) {
  const now = new Date()
  const dateText = `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}-${padNumber(now.getDate())}`
  return sanitizeFileName(`${calculatorName}还款明细_${dateText}.xlsx`)
}

function getMiniProgramFileApi() {
  const candidates = []

  if (typeof globalThis !== 'undefined') {
    candidates.push(globalThis.wx, globalThis.uni)
  }

  if (typeof wx !== 'undefined') candidates.push(wx)
  if (typeof uni !== 'undefined') candidates.push(uni)

  return candidates.find(api => (
    api &&
    typeof api.getFileSystemManager === 'function' &&
    typeof api.openDocument === 'function' &&
    api.env?.USER_DATA_PATH
  ))
}

export function downloadXlsxFile(arrayBuffer, fileName) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    return Promise.resolve({ fileName })
  }

  const miniProgramApi = getMiniProgramFileApi()
  if (miniProgramApi) {
    return new Promise((resolve, reject) => {
      const filePath = `${miniProgramApi.env.USER_DATA_PATH}/${fileName}`
      const fs = miniProgramApi.getFileSystemManager()

      fs.writeFile({
        filePath,
        data: arrayBuffer,
        success: () => {
          miniProgramApi.openDocument({
            filePath,
            fileType: 'xlsx',
            showMenu: true,
            success: () => resolve({ filePath }),
            fail: reject
          })
        },
        fail: reject
      })
    })
  }

  return Promise.reject(new Error('未检测到微信文件系统 API，请重新构建后用微信开发者工具或真机预览测试'))
}
