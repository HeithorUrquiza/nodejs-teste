import { describe, expect, test } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService';
import Usuario from '../../models/usuario';

const authService = new AuthService();

describe('Testando a authService.cadastraUsuario', () => {
  test('Deve retornar um erro ao tentar cadastrar um usuário sem senha', async () => {
    // Arrange
    const usuarioMock = {
      nome: 'Rafael',
      email: 'raphael@teste.com.br',
    };

    // Act
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

    // Assert
    await expect(usuarioSalvo).rejects.toThrowError('A senha de usuario é obrigatório.');
  });

  test('A senha do usuário deve ser criptografada quando for salva no BD', async () => {
    const usuarioMock = {
      nome: 'jhon Doe',
      email: 'jhondoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);
    const senhasIguais = await bcryptjs.compare('senha123', resultado.content.senha);

    expect(senhasIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });

  test('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    const usuarioMock = {
      nome: 'jhon Doe',
      email: 'wick@teste.com',
      senha: 'senha123',
    };

    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);

    await expect(usuarioSalvo).rejects.toThrowError('O email já esta cadastrado!');
  });

  test('Ao cadastrar um usuário deve ser retornada uma mensagem informando que o cadastro foi realizado', async () => {
    const usuarioMock = {
      nome: 'jhon Doe',
      email: 'jhondoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);

    expect(resultado.message).toEqual('usuario criado');

    await Usuario.excluir(resultado.content.id);
  });

  test('Ao cadastrar um usuário, validar o retorno das informações', async () => {
    const usuarioMock = {
      nome: 'jhon Doe',
      email: 'jhondoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(usuarioMock);

    expect(resultado.content).toMatchObject(usuarioMock);

    await Usuario.excluir(resultado.content.id);
  });
});
