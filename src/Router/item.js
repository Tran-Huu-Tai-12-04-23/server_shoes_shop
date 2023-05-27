const express = require("express");
const router = express.Router();
const ItemController = require("../Controller/ItemController");

router.post("/add", ItemController.addNewItem);
router.post("/order", ItemController.orderNewItem);
router.get("/order/user", ItemController.getOrderUser);
router.get("/order/all", ItemController.getOrderAll);
router.get("/order/recently", ItemController.getOrderRecently);
router.get("/order/all-sold", ItemController.getOrderAllSold);
router.get("/order/count-delivery", ItemController.countDelivery);
router.get("/order/count-total", ItemController.countTotalOrder);
router.get("/order/count-balance", ItemController.countBalance);
router.get("/order/count-item-sold", ItemController.countItemSold);
router.put("/order/edit", ItemController.editOrder);
router.put("/order/cancel", ItemController.cancelOrder);
router.get("/all", ItemController.getAllItem);
router.get("/newest", ItemController.getNewestItem);
router.get("/detail", ItemController.getDetailItem);
router.put("/update", ItemController.updateItem);
router.post("/sale/add", ItemController.addSalesItem);
router.get("/sale/all", ItemController.getSaleItem);
router.delete("/sale/delete", ItemController.removeSaleItem);
router.put("/sale/edit", ItemController.saveEditItemSale);
router.put("/delete", ItemController.delete);

module.exports = router;
