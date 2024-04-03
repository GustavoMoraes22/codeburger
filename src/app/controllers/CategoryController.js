import * as Yup from "yup";
import Category from "../models/Category";
import User from "../models/User";

class CategoryController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      // validação do name
      try {
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      // ver se o usuario é admin ou nao
      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { name } = request.body;

      const { filename: path } = request.file;

      // validando categoria repetida
      const categoriasExists = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoriasExists) {
        return response.status(400).json({ error: "Category already exists" });
      }

      // vai criar uma categoria
      const { id } = await Category.create({
        name,
        path,
      });

      return response.json({ id, name });
    } catch (error) {
      console.log(error);
    }
  }

  // metodo para ver todas as categorias
  async index(request, response) {
    try {
      const category = await Category.findAll();

      return response.json(category);
    } catch (error) {
      console.log(error);
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
      });

      // validação do name
      try {
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      // ver se o usuario é admin ou nao
      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { name } = request.body;

      const { id } = request.params;

      // procura o id da categoria
      const category = await Category.findByPk(id);

      // verifica se a categoria existe
      if (!category) {
        return response
          .status(401)
          .json({ error: "Make sure your category id is correct" });
      }

      let path;
      if (request.file) {
        path = request.file.filename;
      }

      await Category.update(
        {
          name,
          path,
        },
        { where: { id } },
      );

      return response.status(200).json();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CategoryController();
