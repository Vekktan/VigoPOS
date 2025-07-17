import express from "express"
import { mockTables } from "../data/mockData"

const router = express.Router()

// GET /api/tables - Get all tables
router.get("/", (req, res) => {
  const { status } = req.query

  let filteredTables = [...mockTables]

  if (status) {
    filteredTables = filteredTables.filter((table) => table.status === status)
  }

  // Sort by table number
  filteredTables.sort((a, b) => a.number - b.number)

  res.json({
    success: true,
    data: filteredTables,
    total: filteredTables.length,
  })
})

// GET /api/tables/:id - Get single table
router.get("/:id", (req, res) => {
  const { id } = req.params
  const table = mockTables.find((table) => table.id === id)

  if (!table) {
    return res.status(404).json({
      success: false,
      error: "Table not found",
    })
  }

  res.json({
    success: true,
    data: table,
  })
})

// GET /api/tables/qr/:qrCode - Get table by QR code
router.get("/qr/:qrCode", (req, res) => {
  const { qrCode } = req.params
  const table = mockTables.find((table) => table.qrCode === qrCode)

  if (!table) {
    return res.status(404).json({
      success: false,
      error: "Table not found",
    })
  }

  res.json({
    success: true,
    data: table,
  })
})

// PUT /api/tables/:id/status - Update table status
router.put("/:id/status", (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const tableIndex = mockTables.findIndex((table) => table.id === id)

  if (tableIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Table not found",
    })
  }

  mockTables[tableIndex].status = status

  res.json({
    success: true,
    data: mockTables[tableIndex],
    message: "Table status updated successfully",
  })
})

export { router as tableRoutes }
