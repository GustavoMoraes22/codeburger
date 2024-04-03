/*
    store  => Cadastrar / adicionar
    index  => Listar vários
    show   => listar apenas um
    update => Atualizar
    delete => Deletar
*/
import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import Order from "../schemas/Order";
import User from "../models/User";

class OrderController {
  async store(request, response) {
    try {
      // O metodo store vai cadastrar o novo usuario

      // Validando informações
      const schema = Yup.object().shape({
        products: Yup.array()
          .required()
          .of(
            Yup.object().shape({
              id: Yup.number().required(),
              quantity: Yup.number().required(),
            }),
          ),
      });

      try {
        // Verifica as informações e retorna o erro
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (err) {
        return response.status(400).json({ error: err.errors });
      }

      // pega só o id do produto que o cliente esta mandando
      const productsId = request.body.products.map((product) => product.id);

      // usa o id para ir buscar o resto das informaçoes do produto
      const upadateProducts = await Product.findAll({
        where: {
          id: productsId,
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });

      // modelar o pedido para vir de uma forma mais coesa
      const editedProduct = upadateProducts.map((product) => {
        const productIndex = request.body.products.findIndex(
          (requestProducts) => requestProducts.id === product.id,
        );

        const newProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category.name,
          url: product.url,
          quantity: request.body.products[productIndex].quantity,
        };

        return newProduct;
      });

      // recebe o pedido do cliente
      const order = {
        user: {
          id: request.userId,
          name: request.userName,
        },
        products: editedProduct,
        status: "Pedido realizado",
      };

      const orderResponse = await Order.create(order);

      return response.status(201).json(orderResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async index(request, response) {
    try {
      const orders = await Order.find();

      return response.json(orders);
    } catch (error) {
      console.log(error);
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        status: Yup.string().required(),
      });

      try {
        // Verifica as informações e retorna o erro
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (err) {
        return response.status(400).json({ error: err.errors });
      }

      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { id } = request.params;
      const { status } = request.body;

      try {
        await Order.updateOne({ _id: id }, { status });
      } catch (error) {
        return response.status(400).json({ error: error.message });
      }

      return response.json({ message: "Status updated sucessfully" });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new OrderController();
