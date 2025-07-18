import React from "react";

interface ProjectProps {
  id: string;
  title: string;
  description: string;
}

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

interface PortfolioProps {
  name?: string;
  aboutText?: string;
  projects?: ProjectProps[];
  skills?: string[];
  contact?: ContactInfo;
}

const ProjectCard: React.FC<ProjectProps> = ({ id, title, description }) => (
  <div className="bg-white p-4 rounded-xl shadow border">
    <h3 className="font-semibold text-journal-stone">{title}</h3>
    <p className="text-sm text-journal-stone/80">{description}</p>
  </div>
);

const Portfolio: React.FC<PortfolioProps> = ({
  name = "Chanathip Khamchan",
  aboutText = "I am a passionate developer with experience in web development.",
  projects = [
    {
      id: "project-1",
      title: "Project 1",
      description: "Description of project 1",
    },
    {
      id: "project-2",
      title: "Project 2",
      description: "Description of project 2",
    },
    {
      id: "project-3",
      title: "Project 3",
      description: "Description of project 3",
    },
    {
      id: "project-4",
      title: "Project 4",
      description: "Description of project 4",
    },
    {
      id: "project-5",
      title: "Project 5",
      description: "Description of project 5",
    },
    {
      id: "project-6",
      title: "Project 6",
      description: "Description of project 6",
    },
  ],
  skills = [
    "Web development",
    "Software engineering",
    "Problem solving",
    "Teamwork",
    "Communication",
  ],
  contact = {
    email: "khoy2589@gmail.com",
    linkedin: "linkedin.com/in/example", // Not available
    github: "github.com/khoy2589",
  },
}) => {
  return (
    <div className="space-y-12 p-2">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-journal-stone">{name}</h1>
        <p className="text-journal-stone/70">Experience</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-journal-stone">About Me</h2>
        <p className="text-journal-stone">{aboutText}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-journal-stone">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-journal-stone">Skills</h2>
        <ul className="list-disc list-inside text-journal-stone/90">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold text-journal-stone">Contact</h2>
        <p className="text-journal-stone">Email: {contact.email}</p>
        {/* <p className="text-journal-stone">LinkedIn: {contact.linkedin}</p> */}
        <p className="text-journal-stone">GitHub: {contact.github}</p>
      </section>
    </div>
  );
};

export default Portfolio;
