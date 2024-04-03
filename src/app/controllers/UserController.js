/*
    store  => Cadastrar / adicionar
    index  => Listar vários
    show   => listar apenas um
    update => Atualizar
    delete => Deletar
*/
import * as Yup from "yup";
import { v4 } from "uuid";
import User from "../models/User";

class UserController {
  async store(request, response) {
    try {
      // O metodo store vai cadastrar o novo usuario

      // Validando informações
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        admin: Yup.boolean(),
      });

      /* if(!(await schema.isValid(request.body))){
          return response
              .status(400)
              .json({error: "Make sure your data is correct"})
      } */

      try {
        // Verifica as informações e retorna o erro
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (err) {
        return response.status(400).json({ error: err.errors });
      }

      const { name, email, password, admin } = request.body;

      // Verificando se um email já existe
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return response.status(409).json({ error: "User already exists" });
      }

      console.log(userExists);

      const user = await User.create({
        id: v4(),
        name,
        email,
        password,
        admin,
      });

      return response.status(201).json({ id: user.id, name, email, admin });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserController();
