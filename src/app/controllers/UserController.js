import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Validation failed, review request body and try again.',
      });
    }

    const user = await User.create(request.body);

    return response.json(user);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldEmail: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Validation failed, review request body and try again.',
      });
    }

    const { oldEmail, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (oldEmail && oldEmail !== user.oldEmail) {
      const userExists = await User.findOne({ where: { oldEmail } });

      if (userExists) {
        return response.status(300).json({ error: 'Email already in use.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Passwords does not match.' });
    }

    const { id, name, email, provider } = await user.update(request.body);

    return response.json({ id, name, email, provider });
  }
}

export default new UserController();
