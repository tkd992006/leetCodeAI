import type { Project } from "../types";

const projects = new Map<string, Project>();
let nextId = 1;

function generateId(): string {
  return `project-${nextId++}`;
}

export const projectStore = {
  createProject(data: {
    name: string;
    description: string;
    authorId: string;
    memberIds?: string[];
  }): Project {
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      authorId: data.authorId,
      memberIds: data.memberIds ?? [data.authorId],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    projects.set(project.id, project);
    return project;
  },

  findProjectById(id: string): Project | undefined {
    const project = projects.get(id);
    if (!project || project.deletedAt !== null) return undefined;
    return project;
  },

  findProjectsByMemberId(memberId: string): Project[] {
    return Array.from(projects.values()).filter(
      (p) => p.deletedAt === null && p.memberIds.includes(memberId),
    );
  },

  findAllProjects(): Project[] {
    return Array.from(projects.values()).filter((p) => p.deletedAt === null);
  },

  updateProject(
    id: string,
    data: Partial<Pick<Project, "name" | "description" | "memberIds">>,
  ): Project | undefined {
    const project = projects.get(id);
    if (!project || project.deletedAt !== null) return undefined;

    if (data.name !== undefined) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;
    if (data.memberIds !== undefined) project.memberIds = data.memberIds;
    project.updatedAt = new Date().toISOString();

    return project;
  },

  softDeleteProject(id: string): boolean {
    const project = projects.get(id);
    if (!project || project.deletedAt !== null) return false;

    project.deletedAt = new Date().toISOString();
    return true;
  },

  _reset(): void {
    projects.clear();
    nextId = 1;
  },
};
