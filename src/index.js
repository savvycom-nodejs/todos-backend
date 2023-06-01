"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const data_json_1 = __importDefault(require("./database/data.json"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Server is started');
});
const listAll = (req, res) => {
    try {
        const { page, pageSize } = req.query;
        if (!page || !pageSize)
            return res.send({ message: "page or pageSize is not founded" });
        const fromIndex = Number(page) * Number(pageSize);
        const toIndex = (Number(page) + 1) * Number(pageSize);
        res.send(data_json_1.default.slice(fromIndex, toIndex));
    }
    catch (err) {
        console.log(err);
        res.send([]);
    }
};
app.get('/api/todos', listAll);
const createTask = (req, res) => {
    try {
        const newItem = req.body;
        data_json_1.default.push(newItem);
        fs.writeFileSync('src/database/data.json', JSON.stringify(data_json_1.default));
        res.send(true);
    }
    catch (err) {
        console.log(err);
        res.send(false);
    }
};
app.post('/api/todos', createTask);
const updateTask = (req, res) => {
    try {
        const payload = req.body;
        const { id } = req.params;
        const updatedItem = data_json_1.default.findIndex((item) => item.id.toString() === id);
        if (updatedItem === -1) {
            return res.send(false);
        }
        data_json_1.default[updatedItem] = Object.assign(data_json_1.default[updatedItem], payload);
        fs.writeFileSync('src/database/data.json', JSON.stringify(data_json_1.default));
        res.send(true);
    }
    catch (err) {
        console.log(err);
        res.send(false);
    }
};
app.patch('/api/todos/:id', updateTask);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
