import { Elysia, t } from 'elysia';
import { BaseController } from '../../../controller/base.controller';
import type { IDepartamentService } from '../service/departament.service.interface';
import {
  createDepartamentSchema,
  updateDepartamentSchema,
  departamentResponseSchema,
  departamentsListResponseSchema,
  errorResponseSchema,
} from '../schema';
import type { CreateDepartamentDto, UpdateDepartamentDto, DepartamentModel } from '../type/departament.types';
import { authMiddleware, adminGuard } from '../../../middleware/auth.middleware';
import { injectable, inject } from 'tsyringe';

@injectable()
export class DepartamentController extends BaseController {
  protected prefix = '/departaments';
  private departamentService: IDepartamentService;

  constructor(@inject('DepartamentService') departamentService: IDepartamentService) {
    super();
    this.departamentService = departamentService;
  }

  protected routes() {
    return new Elysia().group(this.prefix, app =>
      app
        .use(authMiddleware)
        .use(adminGuard)
        .post(
          '/',
          async ({ body }: { body: CreateDepartamentDto }) => {
            const departament = await this.departamentService.createDepartament(body);
            return {
              success: true,
              data: {
                ...departament,
                createdAt: departament.createdAt.toISOString(),
                updatedAt: departament.updatedAt.toISOString(),
              },
            };
          },
          {
            body: createDepartamentSchema,
            response: { 200: departamentResponseSchema, 400: errorResponseSchema },
            detail: {
              tags: ['Departaments'],
              summary: 'Create departament',
              description: 'Creates a new departament',
            },
          }
        )
        .get(
          '/',
          async () => {
            const departaments = await this.departamentService.getDepartaments();
            return {
              success: true,
              data: departaments.map((d: DepartamentModel) => ({
                ...d,
                createdAt: d.createdAt.toISOString(),
                updatedAt: d.updatedAt.toISOString(),
              })),
            };
          },
          {
            response: { 200: departamentsListResponseSchema },
            detail: {
              tags: ['Departaments'],
              summary: 'Get all departaments',
              description: 'Returns all departaments',
            },
          }
        )
        .get(
          '/:id',
          async ({ params }: { params: { id: string } }) => {
            const departament = await this.departamentService.getDepartamentById(params.id);
            if (!departament) {
              return {
                success: false,
                error: { message: 'Departament not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...departament,
                createdAt: departament.createdAt.toISOString(),
                updatedAt: departament.updatedAt.toISOString(),
              },
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Departament ID' }) }),
            response: { 200: departamentResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Departaments'],
              summary: 'Get departament by ID',
              description: 'Returns a departament by its ID',
            },
          }
        )
        .put(
          '/:id',
          async ({ params, body }: { params: { id: string }, body: UpdateDepartamentDto }) => {
            const departament = await this.departamentService.updateDepartament(params.id, body);
            if (!departament) {
              return {
                success: false,
                error: { message: 'Departament not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...departament,
                createdAt: departament.createdAt.toISOString(),
                updatedAt: departament.updatedAt.toISOString(),
              },
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Departament ID' }) }),
            body: updateDepartamentSchema,
            response: { 200: departamentResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Departaments'],
              summary: 'Update departament',
              description: 'Updates a departament by its ID',
            },
          }
        )
        .delete(
          '/:id',
          async ({ params }: { params: { id: string } }) => {
            const departament = await this.departamentService.deleteDepartament(params.id);
            if (!departament) {
              return {
                success: false,
                error: { message: 'Departament not found', code: 'NOT_FOUND' },
              };
            }
            return {
              success: true,
              data: {
                ...departament,
                createdAt: departament.createdAt.toISOString(),
                updatedAt: departament.updatedAt.toISOString(),
              },
              message: 'Departament deleted successfully',
            };
          },
          {
            params: t.Object({ id: t.String({ description: 'Departament ID' }) }),
            response: { 200: departamentResponseSchema, 404: errorResponseSchema },
            detail: {
              tags: ['Departaments'],
              summary: 'Delete departament',
              description: 'Deletes a departament by its ID',
            },
          }
        )
    );
  }
} 