import axios, { Axios } from "axios";

interface Config {
  createAction: string;
  readAction: string;
  updateAction: string;
  deleteAction: string;
  controller: string;
}

class Storage<T extends { id: string }> {
  config: Config;
  api: Axios;

  constructor(config: Config) {
    this.config = config;
    this.api = axios.create({
      baseURL: `/${this.config.controller}`,
    });
  }

  async create(newItem: T): Promise<T> {
    const result = await this.api.post<T>(
      `${this.config.createAction}`,
      newItem
    );

    return result.data;
  }

  async read(): Promise<T[]> {
    const result = await this.api.get<T[]>(`${this.config.readAction}`);

    return result.data;
  }

  async update(id: string, updatedItem: T): Promise<T> {
    const result = await this.api.put<T>(
      `${this.config.updateAction}`,
      updatedItem,
      {
        params: {
          id,
        },
      }
    );

    return result.data;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.api.delete<boolean>(
      `${this.config.deleteAction}`,
      {
        params: {
          id,
        },
      }
    );

    return result.data;
  }
}

export default Storage;
