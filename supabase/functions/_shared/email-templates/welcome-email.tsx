import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>MEZ</Text>
        </Section>
        
        <Heading style={h1}>Welcome to MEZ Auctions</Heading>
        
        <Text style={text}>
          Thank you for subscribing, {name}!
        </Text>
        
        <Text style={text}>
          You'll now receive exclusive alerts about new auctions and unique art pieces from Mariana Mezic. 
          Be the first to know when new works become available and never miss an opportunity to own exceptional art.
        </Text>
        
        <Text style={text}>
          We're thrilled to have you as part of the MEZ Auctions community.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          MEZ Auctions<br />
          Fine Art by Mariana Mezic
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#FFFFFF',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logoText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#D4AF37',
  letterSpacing: '4px',
  margin: '0',
};

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '32px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '32px',
  lineHeight: '22px',
};
