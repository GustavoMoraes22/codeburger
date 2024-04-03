import * as Yup from "yup";
import User from "../models/User";
import authConfing from "../../config/auth";
import jwt from "jsonwebtoken";

class SessionController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      // Menssagem de erro caso o email ou senha estejam errados
      if (!(await schema.isValid(request.body))) {
        return response
          .status(401)
          .json({ error: "Make sure your password or email are correct" });
      }

      const { email, password } = request.body;

      const user = await User.findOne({
        where: { email },
      });

      // Validando o email
      if (!user) {
        return response
          .status(401)
          .json({ error: "Make sure your password or email are correct" });
      }

      // Validando a senha
      if (!(await user.checkPassword(password))) {
        return response
          .status(401)
          .json({ error: "Make sure your password or email are correct" });
      }

      return response.json({
        id: user.id,
        email,
        name: user.name,
        admin: user.admin,
        token: jwt.sign({ id: user.id, name: user.name }, authConfing.secret, {
          expiresIn: authConfing.expiresIn,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new SessionController();
