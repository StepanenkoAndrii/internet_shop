// import {Request, Response} from "express";
// import productService from "../services/product.service";
// import logger from "../utils/logger";
//
// export default {
//     async getAllProducts(req: Request, res: Response) {
//         const products = await productService.getAllProducts();
//         logger.info(products);
//         res.send(products);
//     },
//
//     async getProductById(req: Request, res: Response) {
//         const product = await productService.getProductById(Number(req.params.id));
//         logger.info(product);
//         res.send(product);
//     },
//
//     async deleteProduct(req: Request, res: Response) {
//         const productIsDeleted = await productService.deleteProduct(Number(req.params.id));
//         if (productIsDeleted) {
//             logger.info(productIsDeleted);
//             res.send(`product with id = ${req.params.id} is successfully deleted`);
//         }
//         res.send(`product with id = ${req.params.id} doesn't exist`);
//     },
//
//     async updateProduct(req: Request, res: Response) {
//         const updatedProduct = await productService.updateProduct(Number(req.params.id), req.body);
//         logger.info(updatedProduct);
//         res.send(updatedProduct);
//     },
//
//     async createProduct(req: Request, res: Response) {
//         const newProduct = await productService.createProduct(req.body);
//         logger.info(newProduct);
//         res.send(newProduct);
//     },
// };