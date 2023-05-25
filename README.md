## Capital Gains
Este programa foi desenvolvido em acordo com as especificações do code challenge do processo seletivo do ~omitido~.

### Decisões técnicas e arquiteturais
Este projeto foi desenvolvido utilizando apenas JS ES6. Optei por não utilizar Typescript e/ou bibliotecas externas para manter a solução o mais simples possível.

A regra de negócio da aplicação está no arquivo `src/tax.js`, isolada do código que faz interface com a linha de comando. Garantindo que a lógica de cálculo de taxas possa ser "plugada" em diferentes interfaces sem precisar ser modificada.

Por último, optei por utilizar centavos para realizar as operações sobre valores monetários para evitar problemas com arredondamento e precisão númerica.

## Como executar
A forma mais simples de rodar o programa é via docker. Para isso:

- Builde a imagem
  ```
  docker build -t capital-gains .
  ```
- Crie o container
  ```
  docker create --name capital-gains capital-gains
  ```
- Rode o container
  ```
  docker run -it capital-gains
  ```
  ou
  ```
  docker run -i capital-gains < seu_arquivo.json
  ```

## Rodando testes
Para rodar os testes é preciso ter o Node 14 instalado na máquina.
1. Instale as dependências
```
npm install
```
2. Rode os testes
```
npm run test
```