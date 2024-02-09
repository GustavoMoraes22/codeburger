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

class UserConstroller {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password_hash: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    /* if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: "Make sure your date is correct" });
   } */

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ error: error.errors });
    }

    const { name, email, password_hash, admin } = request.body;

    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      admin,
    });

    return response.status(201).json({ id: user.id, name, email });
  }
}

export default new UserConstroller();
