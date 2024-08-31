"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageUploadController_1 = require("../controllers/imageUploadController");
const router = (0, express_1.Router)();
router.post('/upload', imageUploadController_1.uploadImage);
exports.default = router;
