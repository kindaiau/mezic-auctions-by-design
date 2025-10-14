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

interface AuctionStartProps {
  auctionTitle: string;
  artist: string;
  startingBid: number;
  endDate: string;
}

export const AuctionStart = ({
  auctionTitle,
  artist,
  startingBid,
  endDate,
}: AuctionStartProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>MEZ</Text>
        </Section>
        
        <Section style={badge}>
          <Text style={badgeText}>🎨 NEW AUCTION LIVE</Text>
        </Section>
        
        <Heading style={h1}>"{auctionTitle}"</Heading>
        
        <Text style={artistText}>by {artist}</Text>
        
        <Section style={auctionCard}>
          <Section style={detailRow}>
            <Text style={detailLabel}>Starting Bid</Text>
            <Text style={startingBidValue}>${startingBid.toLocaleString()}</Text>
          </Section>
          
          <Hr style={cardHr} />
          
          <Section style={detailRow}>
            <Text style={detailLabel}>Auction Ends</Text>
            <Text style={detailValue}>{endDate}</Text>
          </Section>
        </Section>
        
        <Text style={text}>
          A stunning new piece from Mariana Mezic's collection is now available for bidding. 
          This is your opportunity to own an exceptional work of art.
        </Text>
        
        <Section style={ctaSection}>
          <Text style={ctaText}>VIEW & BID NOW</Text>
        </Section>
        
        <Text style={smallText}>
          Don't miss out on this exclusive opportunity. Place your bid today!
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
  marginBottom: '24px',
};

const logoText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#D4AF37',
  letterSpacing: '4px',
  margin: '0',
};

const badge = {
  textAlign: 'center' as const,
  backgroundColor: '#D4AF37',
  borderRadius: '24px',
  padding: '8px 24px',
  display: 'inline-block',
  margin: '0 auto 24px',
};

const badgeText = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#000000',
  letterSpacing: '2px',
  margin: '0',
};

const h1 = {
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '16px 0',
  lineHeight: '1.3',
};

const artistText = {
  fontSize: '18px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
  fontStyle: 'italic',
};

const auctionCard = {
  backgroundColor: '#F5F5F5',
  border: '2px solid #D4AF37',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '8px 0',
};

const detailLabel = {
  fontSize: '14px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0',
};

const startingBidValue = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#D4AF37',
  margin: '0',
};

const detailValue = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  margin: '0',
};

const cardHr = {
  borderColor: '#D4AF37',
  margin: '16px 0',
  opacity: 0.3,
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const smallText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '16px',
  backgroundColor: '#D4AF37',
  borderRadius: '4px',
};

const ctaText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  letterSpacing: '2px',
  margin: '0',
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
