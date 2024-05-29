import request from 'supertest';
import {
  afterEach, beforeEach, describe, expect, test,
} from '@jest/globals';
import app from '../../app.js';

let servidor;
beforeEach(() => {
  const porta = 3030;
  servidor = app.listen(porta);
});

afterEach(() => {
  servidor.close();
});

describe('POST na rota de /login', () => {
  test('Deve retornar um erro caso falte email ou senha na autenticação', async () => {
    const loginMock = {
      email: 'raphael@teste.com.br',
    };

    await request(servidor)
      .post('/login')
      .send(loginMock)
      .expect(500)
      .expect('"A senha de usuario é obrigatório."');
  });

  test('Deve validar se o usuário está cadastrado', async () => {
    const loginMock = {
      email: 'wick@teste.com',
      senha: 'teste123',
    };

    const resposta = await request(servidor)
      .post('/login')
      .send(loginMock)
      .expect(200);

    expect(resposta.body.message).toBe('Usuario conectado');
  });

  test('Deve validar se o usuário não está cadastrado', async () => {
    const loginMock = {
      email: 'joana@teste.com',
      senha: 'teste123',
    };

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario não cadastrado."');
  });

  test('Deve retornar um erro para email e senha incorretos', async () => {
    const loginMock = {
      email: 'wick@teste.com',
      senha: 'teste12',
    };

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario ou senha invalido."');
  });

  test('Deve validar se está sendo retornado um accessToken', async () => {
    const loginMock = {
      email: 'wick@teste.com',
      senha: 'teste123',
    };

    const resposta = await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(200);

    expect(resposta.body.message).toBe('Usuario conectado');
    expect(resposta.body).toHaveProperty('accessToken');
  });
});
