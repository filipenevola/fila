import Hapi from '@hapi/hapi';

let fila = [];

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request) => {
      const idx = fila.findIndex((elem) => elem.nome === request.query.nome);

      if (idx === -1) {
        return `${request.query.nome} não está na fila`;
      }

      return `${idx + 1}º ${fila[idx].status}`;
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: (request) => {
      const idx = fila.findIndex((elem) => elem.nome === request.query.nome);
      if (idx !== -1) {
        return `${request.query.nome} já está na fila`;
      }

      fila.push({nome: request.query.nome, status: 'esperando'});
      return `${request.query.nome} em ${fila.length}º esperando`;
    }
  });

  server.route({
    method: 'PUT',
    path: '/',
    handler: (request) => {
      const idx = fila.findIndex((elem) => elem.nome === request.query.nome);

      if (idx === -1) {
        return `${request.query.nome} não está na fila`;
      }
      if (idx === 0) {
        fila = fila.map(elem => elem.nome === request.query.nome ? {
          ...elem,
          status: 'comprando'
        } : elem);
        return `${request.query.nome} agora está comprando`;
      }
      return `${request.query.nome} ainda não está em primeiro para comprar`;
    }
  });

  server.route({
    method: 'DELETE',
    path: '/',
    handler: (request) => {
      const idx = fila.findIndex((elem) => elem.nome === request.query.nome);

      if (idx === -1) {
        return `${request.query.nome} não está na fila`;
      }
      fila = fila.filter(elem => elem.nome === request.query.nome ? null : elem).filter(Boolean);
      return `${request.query.nome} saiu da fila`;
    }
  });
  server.route({
    method: 'GET',
    path: '/fila',
    handler: () => {
      if (!fila.length) {
        return `A fila está vazia`;
      }

      return fila.map((elem, idx) => `${elem.nome} em ${idx + 1}º ${fila[idx].status}`).join('<br/>');
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init().catch(e => console.error(`Error on init`, e));
