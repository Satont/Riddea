import { Session } from "@mgcrea/fastify-session";
import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection, Upload } from "@riddea/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { apiLogger } from "../main";
import { GetCollectionImages } from "./validations/getCollectionImages";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) private collectionRepository: Repository<Collection>,
    @InjectRepository(Upload) private uploadRepository: Repository<Upload>,
  ) {}

  async getCollection(id: string) {
    try {
      const collection = await this.collectionRepository.findOne(id);

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      if (!collection.isPublic) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      }

      return collection;
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  getCollectionsByUser(userID: string | number, session?: Session) {
    try {
      return this.collectionRepository.find({
        userID: Number(userID),
        isPublic: session?.get("user")?.id == userID ? Not(IsNull()) : true,
      });
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  async getCollectionImages(id: string, query: GetCollectionImages) {
    try {
      const [collection, uploads, total] = await Promise.all([
        this.collectionRepository.findOne({
          where: {
            id,
          },
        }),

        this.uploadRepository.find({
          where: {
            collection: {
              id,
            },
            data: Not(IsNull()),
          },
          take: Number(query.limit),
          skip: Number(query.limit) * (Number(query.page) - 1),
          order: {
            createdAt: "DESC",
          },
        }),

        this.uploadRepository.count({
          where: {
            collection: {
              id,
            },
            data: Not(IsNull()),
          },
        }),
      ]);

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      if (!collection.isPublic) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      }

      return [uploads, total];
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }
}
