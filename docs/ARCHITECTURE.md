# Email Architecture Diagram

## Current Setup (Resend Only)

```
┌─────────────────┐
│  User Actions   │
└────────┬────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌────────────────┐                ┌───────────────┐
│ Newsletter     │                │ Place Bid     │
│ Signup         │                │               │
└────────┬───────┘                └───────┬───────┘
         │                                 │
         ▼                                 ▼
    ┌────────────────────────────────────────┐
    │           Resend API                   │
    │     (Transactional Emails)             │
    └────────┬───────────────────────────────┘
             │
             ├─────────────┬──────────────┐
             │             │              │
             ▼             ▼              ▼
        ┌────────┐    ┌────────┐    ┌─────────┐
        │Welcome │    │  Bid   │    │ Outbid  │
        │ Email  │    │Confirm │    │  Alert  │
        └────────┘    └────────┘    └─────────┘
```

## Recommended Setup (Resend + Klaviyo)

```
┌──────────────────────────────────────────────────────┐
│                  User Actions                        │
└───────────────────┬──────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌────────────────┐
│   Newsletter  │      │   Place Bid    │
│    Signup     │      │                │
└───────┬───────┘      └────────┬───────┘
        │                       │
        │                       │
        ├───────────────────────┤
        │                       │
        ▼                       ▼
┌─────────────────────────────────────────┐
│        Supabase Edge Function           │
└────────┬─────────────────────┬──────────┘
         │                     │
         │                     │
         ▼                     ▼
    ┌────────┐         ┌──────────────┐
    │ Resend │         │   Klaviyo    │
    │ (Fast) │         │  (Strategic) │
    └───┬────┘         └──────┬───────┘
        │                     │
        │                     │
        ▼                     ▼
┌───────────────┐    ┌─────────────────────┐
│ Immediate     │    │  Marketing Lists    │
│ Transactional │    │  & Segments         │
│               │    │                     │
│ • Welcome     │    │ • All Subscribers   │
│ • Bid Confirm │    │ • Active Bidders    │
│ • Outbid      │    │ • High Value        │
│               │    │ • Inactive Users    │
└───────────────┘    └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  Automated Flows    │
                     │                     │
                     │ • Drip Campaigns    │
                     │ • Newsletters       │
                     │ • Re-engagement     │
                     │ • A/B Testing       │
                     └─────────────────────┘
```

## Email Flow Example

### User Journey with Both Systems

```
Day 0: User Subscribes
    ↓
    Resend ──→ [Instant Welcome Email]
    Klaviyo ──→ [Add to "New Subscribers" segment]
    
Day 3: Automated Follow-up
    ↓
    Klaviyo ──→ [Getting Started Email]
    
Day 7: Weekly Newsletter
    ↓
    Klaviyo ──→ [Current Auctions Newsletter]
    
Day 10: User Places First Bid
    ↓
    Resend ──→ [Instant Bid Confirmation]
    Klaviyo ──→ [Update profile: Active Bidder]
    
Day 11: User is Outbid
    ↓
    Resend ──→ [Instant Outbid Alert]
    
Day 14: Weekly Newsletter
    ↓
    Klaviyo ──→ [Personalized with similar auctions]
    
Day 40: No activity for 30 days
    ↓
    Klaviyo ──→ [Re-engagement Campaign]
```

## Key Differences Table

| Feature | Resend | Klaviyo |
|---------|--------|---------|
| **Purpose** | Transactional | Marketing |
| **Trigger** | User action | Schedule/Automation |
| **Speed** | Instant | Scheduled |
| **Personalization** | Basic | Advanced |
| **Segmentation** | None | Sophisticated |
| **Analytics** | Basic delivery | Full campaign analytics |
| **A/B Testing** | No | Yes |
| **Cost** | Per-email | Per-contact |
| **Best For** | Real-time notifications | Campaign management |

## Decision Matrix

### Use Resend When:
✅ Email must be sent immediately  
✅ Triggered by user action  
✅ Confirmation or notification  
✅ Simple content  
✅ One-time send  

### Use Klaviyo When:
✅ Email is part of a campaign  
✅ Scheduled or time-delayed  
✅ Need segmentation  
✅ Want to track engagement  
✅ A/B testing needed  
✅ Part of customer journey  

## Cost Comparison Example

### For 1,000 subscribers and 10,000 emails/month:

**Resend Only**
- Transactional emails: ~$10/month
- Marketing emails: ~$10/month
- **Total: ~$20/month**
- ❌ No segmentation
- ❌ No automation
- ❌ Limited analytics

**Resend + Klaviyo**
- Resend (transactional): ~$10/month
- Klaviyo (up to 1,000 contacts): Free
- **Total: ~$10/month**
- ✅ Full segmentation
- ✅ Marketing automation
- ✅ Rich analytics
- ✅ A/B testing

*Note: Klaviyo pricing increases after 250 contacts on free plan*

## Implementation Checklist

- [x] Resend configured for transactional emails
- [ ] Klaviyo account created
- [ ] Klaviyo API key added to Supabase secrets
- [ ] Sync function created (`sync-to-klaviyo`)
- [ ] Subscribe function updated to sync to Klaviyo
- [ ] Bid function updated to track activity
- [ ] Lists created in Klaviyo
- [ ] Segments configured
- [ ] Welcome series created (3 emails)
- [ ] Weekly newsletter template created
- [ ] Re-engagement flow created
- [ ] Analytics dashboard set up

## Summary

This dual-system approach gives you:
1. **Reliability** - Instant transactional emails via Resend
2. **Sophistication** - Advanced marketing via Klaviyo
3. **Efficiency** - Right tool for each job
4. **Scalability** - Grow your marketing without technical debt
5. **Best Practice** - Industry-standard architecture
