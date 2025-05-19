import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.mjs';
import albumController from './controllers/albumController.mjs';
import photoController from './controllers/photoController.mjs';

const env = process.env.NODE_ENV || 'development';
const settings = config[env];

class Server {
  constructor() {
    this.app = express();
    this.config();
    this.mongo();
    this.routes();
  }

  config() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  mongo() {
    mongoose.set('strictQuery', false);
    mongoose.connect(settings.mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log(`✅ MongoDB connecté (${env})`);
        this.app.listen(settings.port, () => {
          console.log(`🚀 Serveur lancé sur http://localhost:${settings.port}`);
        });
      })
      .catch((err) => {
        console.error('❌ Erreur MongoDB :', err.message);
      });
  }

  routes() {
    this.app.get('/api/albums', albumController.getAllAlbums);
    this.app.get('/api/album/:id', albumController.getAlbumById);
    this.app.post('/api/album', albumController.createAlbum);
    this.app.put('/api/album/:id', albumController.updateAlbum);
    this.app.delete('/api/album/:id', albumController.deleteAlbum);

    this.app.get('/api/album/:idalbum/photos', photoController.getPhotosByAlbum);
    this.app.get('/api/album/:idalbum/photo/:idphotos', photoController.getPhotoById);
    this.app.post('/api/album/:idalbum/photo', photoController.addPhotoToAlbum);
    this.app.put('/api/album/:idalbum/photo/:idphotos', photoController.updatePhoto);
    this.app.delete('/api/album/:idalbum/photo/:idphotos', photoController.deletePhoto);

    this.app.use((req, res) => {
      res.status(404).json({ code: 404, message: 'Not Found' });
    });
  }
}

new Server();
export default Server;
