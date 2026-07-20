import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Project = Database["public"]["Tables"]["projects_projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects_projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects_projects"]["Update"];
type Task = Database["public"]["Tables"]["projects_tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["projects_tasks"]["Insert"];
type TaskUpdate = Database["public"]["Tables"]["projects_tasks"]["Update"];

export interface ProjectsSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasks: number;
}

export const ProjectsService = {
  async getProjects(organizationId?: string): Promise<Project[]> {
    let query = supabase
      .from("projects_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects_projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from("projects_projects")
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from("projects_projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects_projects").delete().eq("id", id);

    if (error) throw error;
  },

  async getTasks(organizationId?: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from("projects_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }
    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createTask(task: TaskInsert): Promise<Task> {
    const { data, error } = await supabase.from("projects_tasks").insert(task).select().single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from("projects_tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from("projects_tasks").delete().eq("id", id);

    if (error) throw error;
  },

  async getSummary(organizationId?: string): Promise<ProjectsSummary> {
    const projects = await this.getProjects(organizationId);
    const tasks = await this.getTasks(organizationId);

    const activeProjects = projects.filter(
      (p) => p.status === "in_progress" || p.status === "planning",
    ).length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const today = new Date().toISOString().split("T")[0];
    const overdueTasks = tasks.filter(
      (t) => t.due_date && t.due_date < today && t.status !== "done",
    ).length;

    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      completionRate,
      overdueTasks,
    };
  },
};
