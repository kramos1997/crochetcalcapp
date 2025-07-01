import {
  users,
  projects,
  projectCategories,
  projectTemplates,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type UpdateProject,
  type ProjectCategory,
  type InsertProjectCategory,
  type ProjectTemplate,
  type InsertProjectTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: number, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, userId: string, updates: UpdateProject): Promise<Project>;
  deleteProject(id: number, userId: string): Promise<void>;
  
  // Category operations
  getProjectCategories(): Promise<ProjectCategory[]>;
  createProjectCategory(category: InsertProjectCategory): Promise<ProjectCategory>;
  
  // Template operations
  getProjectTemplates(userId?: string): Promise<ProjectTemplate[]>;
  getProjectTemplate(id: number): Promise<ProjectTemplate | undefined>;
  createProjectTemplate(template: InsertProjectTemplate): Promise<ProjectTemplate>;
  
  // Analytics
  getUserProjectStats(userId: string): Promise<{
    totalProjects: number;
    totalRevenue: number;
    totalHours: number;
    avgMargin: number;
    monthlyProjects: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number, userId: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const projectData = {
      ...project,
      materials: project.materials || null,
    };
    
    const [newProject] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return newProject;
  }

  async updateProject(id: number, userId: string, updates: UpdateProject): Promise<Project> {
    const updateData = {
      ...updates,
      materials: updates.materials || null,
      updatedAt: new Date()
    };
    
    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number, userId: string): Promise<void> {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
  }

  // Category operations
  async getProjectCategories(): Promise<ProjectCategory[]> {
    return await db.select().from(projectCategories);
  }

  async createProjectCategory(category: InsertProjectCategory): Promise<ProjectCategory> {
    const [newCategory] = await db
      .insert(projectCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Template operations
  async getProjectTemplates(userId?: string): Promise<ProjectTemplate[]> {
    if (userId) {
      return await db
        .select()
        .from(projectTemplates)
        .where(
          and(
            eq(projectTemplates.isPublic, true)
          )
        );
    }
    return await db
      .select()
      .from(projectTemplates)
      .where(eq(projectTemplates.isPublic, true));
  }

  async getProjectTemplate(id: number): Promise<ProjectTemplate | undefined> {
    const [template] = await db
      .select()
      .from(projectTemplates)
      .where(eq(projectTemplates.id, id));
    return template;
  }

  async createProjectTemplate(template: InsertProjectTemplate): Promise<ProjectTemplate> {
    const [newTemplate] = await db
      .insert(projectTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  // Analytics
  async getUserProjectStats(userId: string): Promise<{
    totalProjects: number;
    totalRevenue: number;
    totalHours: number;
    avgMargin: number;
    monthlyProjects: number;
    monthlyRevenue: number;
  }> {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyProjects = userProjects.filter(p => 
      p.createdAt && p.createdAt >= startOfMonth
    );

    const totalRevenue = userProjects.reduce((sum, p) => 
      sum + (parseFloat(p.retailPrice?.toString() || "0")), 0
    );

    const totalHours = userProjects.reduce((sum, p) => 
      sum + (parseFloat(p.hoursSpent?.toString() || "0")), 0
    );

    const monthlyRevenue = monthlyProjects.reduce((sum, p) => 
      sum + (parseFloat(p.retailPrice?.toString() || "0")), 0
    );

    const avgMargin = userProjects.length > 0 
      ? userProjects.reduce((sum, p) => 
          sum + (parseFloat(p.profitMargin?.toString() || "0")), 0
        ) / userProjects.length
      : 0;

    return {
      totalProjects: userProjects.length,
      totalRevenue,
      totalHours,
      avgMargin,
      monthlyProjects: monthlyProjects.length,
      monthlyRevenue,
    };
  }
}

// Temporarily use in-memory storage to get calculator working
class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private categories: ProjectCategory[] = [
    { id: 1, name: 'Blankets', description: 'Cozy blankets and throws', createdAt: new Date() },
    { id: 2, name: 'Hats', description: 'Warm hats and beanies', createdAt: new Date() },
    { id: 3, name: 'Scarves', description: 'Stylish scarves and wraps', createdAt: new Date() },
    { id: 4, name: 'Bags', description: 'Practical bags and purses', createdAt: new Date() },
  ];
  private templates: ProjectTemplate[] = [];
  private nextProjectId = 1;
  private nextTemplateId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getProject(id: number, userId: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    return project?.userId === userId ? project : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: this.nextProjectId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, userId: string, updates: UpdateProject): Promise<Project> {
    const project = this.projects.get(id);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found');
    }
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number, userId: string): Promise<void> {
    const project = this.projects.get(id);
    if (project?.userId === userId) {
      this.projects.delete(id);
    }
  }

  async getProjectCategories(): Promise<ProjectCategory[]> {
    return this.categories;
  }

  async createProjectCategory(category: InsertProjectCategory): Promise<ProjectCategory> {
    const newCategory: ProjectCategory = {
      ...category,
      id: this.categories.length + 1,
      createdAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async getProjectTemplates(userId?: string): Promise<ProjectTemplate[]> {
    return this.templates.filter(t => t.isPublic || t.createdBy === userId);
  }

  async getProjectTemplate(id: number): Promise<ProjectTemplate | undefined> {
    return this.templates.find(t => t.id === id);
  }

  async createProjectTemplate(template: InsertProjectTemplate): Promise<ProjectTemplate> {
    const newTemplate: ProjectTemplate = {
      ...template,
      id: this.nextTemplateId++,
      createdAt: new Date(),
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async getUserProjectStats(userId: string): Promise<{
    totalProjects: number;
    totalRevenue: number;
    totalHours: number;
    avgMargin: number;
    monthlyProjects: number;
    monthlyRevenue: number;
  }> {
    const userProjects = Array.from(this.projects.values()).filter(p => p.userId === userId);
    const completedProjects = userProjects.filter(p => p.status === 'completed');
    
    const totalRevenue = completedProjects.reduce((sum, p) => sum + (parseFloat(p.retailPrice || '0')), 0);
    const totalHours = userProjects.reduce((sum, p) => sum + (parseFloat(p.hoursSpent || '0')), 0);
    const avgMargin = completedProjects.length > 0 
      ? completedProjects.reduce((sum, p) => sum + (parseFloat(p.profitMargin || '0')), 0) / completedProjects.length 
      : 0;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyProjects = userProjects.filter(p => p.createdAt && p.createdAt >= thisMonth).length;
    const monthlyRevenue = userProjects
      .filter(p => p.createdAt && p.createdAt >= thisMonth && p.status === 'completed')
      .reduce((sum, p) => sum + (parseFloat(p.retailPrice || '0')), 0);

    return {
      totalProjects: userProjects.length,
      totalRevenue,
      totalHours,
      avgMargin,
      monthlyProjects,
      monthlyRevenue,
    };
  }
}

export const storage = new MemStorage();
