import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  background: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const TechList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TechItem = styled.div`
  background: ${props => props.theme.colors.light};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  font-weight: 500;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '✅';
    margin-right: 0.5rem;
  }
`;

const CodeBlock = styled.pre`
  background: ${props => props.theme.colors.dark};
  color: white;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow-x: auto;
  margin: 1rem 0;
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <PageTitle>About This Project</PageTitle>

      <Section>
        <SectionTitle>Project Overview</SectionTitle>
        <p>
          This is Project 1 of a comprehensive DevOps portfolio series. It demonstrates
          modern full-stack development practices with containerization, CI/CD, and cloud deployment.
        </p>
        <p>
          The application showcases a complete DevOps workflow from development to production,
          including automated testing, building, and deployment processes.
        </p>
      </Section>

      <Section>
        <SectionTitle>Technologies Used</SectionTitle>
        <TechList>
          <TechItem>React.js</TechItem>
          <TechItem>TypeScript</TechItem>
          <TechItem>Node.js</TechItem>
          <TechItem>Express</TechItem>
          <TechItem>PostgreSQL</TechItem>
          <TechItem>Docker</TechItem>
          <TechItem>Docker Compose</TechItem>
          <TechItem>Nginx</TechItem>
          <TechItem>GitHub Actions</TechItem>
          <TechItem>AWS/Azure</TechItem>
        </TechList>
      </Section>

      <Section>
        <SectionTitle>Key Features</SectionTitle>
        <FeatureList>
          <FeatureItem>Modern React frontend with TypeScript</FeatureItem>
          <FeatureItem>RESTful API with Express.js</FeatureItem>
          <FeatureItem>PostgreSQL database with proper migrations</FeatureItem>
          <FeatureItem>Docker containerization for all services</FeatureItem>
          <FeatureItem>Docker Compose for local development</FeatureItem>
          <FeatureItem>Nginx reverse proxy configuration</FeatureItem>
          <FeatureItem>GitHub Actions CI/CD pipeline</FeatureItem>
          <FeatureItem>Cloud deployment ready</FeatureItem>
          <FeatureItem>Health checks and monitoring</FeatureItem>
          <FeatureItem>Environment-based configuration</FeatureItem>
          <FeatureItem>Security best practices</FeatureItem>
          <FeatureItem>Comprehensive documentation</FeatureItem>
        </FeatureList>
      </Section>

      <Section>
        <SectionTitle>Quick Start</SectionTitle>
        <p>To run this project locally:</p>
        <CodeBlock>
{`# Clone the repository
git clone <repository-url>
cd devops-portfolio/project-1

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432`}
        </CodeBlock>
      </Section>

      <Section>
        <SectionTitle>DevOps Learning Outcomes</SectionTitle>
        <p>
          This project demonstrates essential DevOps skills including:
        </p>
        <FeatureList>
          <FeatureItem>Containerization with Docker</FeatureItem>
          <FeatureItem>Multi-container orchestration</FeatureItem>
          <FeatureItem>CI/CD pipeline design and implementation</FeatureItem>
          <FeatureItem>Cloud deployment strategies</FeatureItem>
          <FeatureItem>Database containerization</FeatureItem>
          <FeatureItem>Reverse proxy configuration</FeatureItem>
          <FeatureItem>Environment management</FeatureItem>
          <FeatureItem>Health checks and monitoring</FeatureItem>
          <FeatureItem>Security best practices</FeatureItem>
          <FeatureItem>Documentation and maintenance</FeatureItem>
        </FeatureList>
      </Section>

      <Section>
        <SectionTitle>Next Steps</SectionTitle>
        <p>
          This project serves as the foundation for the remaining portfolio projects:
        </p>
        <FeatureList>
          <FeatureItem>Project 2: Infrastructure as Code with Terraform</FeatureItem>
          <FeatureItem>Project 3: Kubernetes Microservices with Monitoring</FeatureItem>
          <FeatureItem>Project 4: Multi-Cloud Disaster Recovery</FeatureItem>
          <FeatureItem>Project 5: Security & Compliance Automation</FeatureItem>
        </FeatureList>
      </Section>
    </AboutContainer>
  );
};

export default About;
