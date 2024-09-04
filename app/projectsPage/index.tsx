import { useEffect, useState } from 'react';
import ProjectCard from '../components/projectCard';
import { Project } from '../types/project'; 

const ProjectsPage = ({ filter }: { filter: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();

      const filteredProjects = data.projects.filter((project: Project) => {
        if (filter === 'All') return true;
        return project.status === filter;
      });

      setProjects(filteredProjects);
    };

    fetchProjects();
  }, [filter]);

  return (
    <div className="flex flex-col mx-auto gap-4">
      {projects.map((project) => (
        <ProjectCard 
          _id={project._id}
          key={project._id} 
          title={project.title} 
          description={project.description} 
          imageUrl={project.imageUrl} 
          url={project.url} 
          language={project.language || undefined} 
          budget={project.budget} 
          worktype={project.worktype} 
          status={project.status} 
          startDate={project.startDate} 
          endDate={project.endDate || null} 
          createdAt={project.createdAt} 
        />
      ))}
    </div>
  );
};

export default ProjectsPage;
