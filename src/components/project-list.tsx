import { Search } from "lucide-react";
import React from "react";

interface Project{
    id: number;
    name: string;
    description: string;
}

interface ProjectListProps {
  projects: Project[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedProject: Project | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  search,
  setSearch,
  selectedProject,
  setSelectedProject,
}) => {
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-1/3 max-w-sm bg-[var(--color-box-3)] rounded-tr-3xl shadow-md p-4 flex flex-col">
      <div className="relative w-full mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-1)]" />
      <input
        type="text"
        placeholder="Buscar projeto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[var(--foreground)] text-[var(--color-text-1)] placeholder-[var(--color-text-2)] rounded-2xl pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-1)]"
      />
    </div>
      <div className="overflow-y-auto flex-1"style={{
        scrollbarWidth: "thin",
        scrollbarColor: "var(--color-box-1) var(--color-box-3)", 
      }}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                selectedProject?.id === project.id
                  ? "bg-[var(--color-box-2)]"
                  : "hover:bg-[var(--color-hover)]"
              }`}
            >
              <h2 className="text-lg font-medium text-[var(--color-text-1)]">
                {project.name}
              </h2>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhum projeto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
