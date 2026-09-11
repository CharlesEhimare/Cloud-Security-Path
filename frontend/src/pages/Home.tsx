import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';

const HomeContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.light}, ${props => props.theme.colors.info}20);
  padding: 4rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textMuted};
  line-height: 1.6;
`;

const StatusCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  margin: 2rem 0;
`;

const StatusTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const StatusLabel = styled.span`
  font-weight: 500;
`;

const StatusValue = styled.span<{ $status: 'success' | 'error' | 'warning' }>`
  color: ${props => {
    switch (props.$status) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.danger;
      case 'warning': return props.theme.colors.warning;
      default: return props.theme.colors.text;
    }
  }};
  font-weight: 500;
`;

const Home: React.FC = () => {
  const { data: health, isLoading } = useQuery('health', apiService.getHealth, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <HomeContainer>
      <Hero>
        <Title>DevOps Portfolio Project 1</Title>
        <Subtitle>
          Full-Stack Containerized Web Application with CI/CD Pipeline
        </Subtitle>
      </Hero>

      <StatusCard>
        <StatusTitle>System Status</StatusTitle>
        {isLoading ? (
          <p>Loading system status...</p>
        ) : (
          <>
            <StatusItem>
              <StatusLabel>Backend API</StatusLabel>
              <StatusValue $status={health?.status === 'ok' ? 'success' : 'error'}>
                {health?.status === 'ok' ? 'Online' : 'Offline'}
              </StatusValue>
            </StatusItem>
            <StatusItem>
              <StatusLabel>Database</StatusLabel>
              <StatusValue $status={health?.database === 'connected' ? 'success' : 'error'}>
                {health?.database === 'connected' ? 'Connected' : 'Disconnected'}
              </StatusValue>
            </StatusItem>
            <StatusItem>
              <StatusLabel>Uptime</StatusLabel>
              <StatusValue $status="success">
                {health?.uptime || 'N/A'}
              </StatusValue>
            </StatusItem>
          </>
        )}
      </StatusCard>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>🐳</FeatureIcon>
          <FeatureTitle>Docker Containerization</FeatureTitle>
          <FeatureDescription>
            Multi-container application with Docker and Docker Compose for development and production environments.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔄</FeatureIcon>
          <FeatureTitle>CI/CD Pipeline</FeatureTitle>
          <FeatureDescription>
            Automated testing, building, and deployment using GitHub Actions with cloud integration.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>☁️</FeatureIcon>
          <FeatureTitle>Cloud Deployment</FeatureTitle>
          <FeatureDescription>
            Production-ready deployment on AWS/Azure with proper scaling and monitoring capabilities.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Monitoring & Health Checks</FeatureTitle>
          <FeatureDescription>
            Real-time system monitoring with health checks and performance metrics.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>Security Best Practices</FeatureTitle>
          <FeatureDescription>
            Implemented security measures including environment variables, secure headers, and input validation.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>Comprehensive Documentation</FeatureTitle>
          <FeatureDescription>
            Detailed documentation covering setup, deployment, and maintenance procedures.
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </HomeContainer>
  );
};

export default Home;
