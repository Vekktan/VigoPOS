import express from "express"
import { mockMenuItems } from "../data/mockData"

const router = express.Router()

// GET /api/menu - Get all menu items
router.get("/", (req, res) => {
  const { category, available } = req.query

  let filteredItems = [...mockMenuItems]

  // Filter by category
  if (category && category !== "all") {
    filteredItems = filteredItems.filter((item) => item.category === category)
  }

  // Filter by availability
  if (available !== undefined) {
    const isAvailable = available === "true"
    filteredItems = filteredItems.filter((item) => item.available === isAvailable)
  }

  res.json({
    success: true,
    data: filteredItems,
    total: filteredItems.length,
  })
})

// GET /api/menu/:id - Get single menu item
router.get("/:id", (req, res) => {
  const { id } = req.params
  const item = mockMenuItems.find((item) => item.id === id)

  if (!item) {
    return res.status(404).json({
      success: false,
      error: "Menu item not found",
    })
  }

  res.json({
    success: true,
    data: item,
  })
})

// POST /api/menu - Create new menu item (for cashier app)
router.post("/", (req, res) => {
  const newItem = {
    id: `item-${Date.now()}`,
    ...req.body,
    available: true,
  }

  mockMenuItems.push(newItem)

  res.status(201).json({
    success: true,
    data: newItem,
    message: "Menu item created successfully",
  })
})

// PUT /api/menu/:id - Update menu item
router.put("/:id", (req, res) => {
  const { id } = req.params
  const itemIndex = mockMenuItems.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Menu item not found",
    })
  }

  mockMenuItems[itemIndex] = {
    ...mockMenuItems[itemIndex],
    ...req.body,
  }

  res.json({
    success: true,
    data: mockMenuItems[itemIndex],
    message: "Menu item updated successfully",
  })
})

// DELETE /api/menu/:id - Delete menu item
router.delete("/:id", (req, res) => {
  const { id } = req.params
  const itemIndex = mockMenuItems.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Menu item not found",
    })
  }

  const deletedItem = mockMenuItems.splice(itemIndex, 1)[0]

  res.json({
    success: true,
    data: deletedItem,
    message: "Menu item deleted successfully",
  })
})

export { router as menuRoutes }
