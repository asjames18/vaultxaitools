import { z } from 'zod';

export const createToolSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  priceTier: z.enum(['Free', 'Paid', 'Freemium']),
  affiliateUrl: z.string().url().optional(),
  // Add any other fields your `tools` table requires
});

export const updateToolSchema = createToolSchema.partial().extend({
  id: z.string().uuid(),
}); 