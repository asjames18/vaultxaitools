import { generateAffiliateUrl } from '../affiliate';

test('generates UTM params', () => {
  const url = generateAffiliateUrl('https://example.com', 'test-tool');
  expect(url).toContain('utm_source=vaultx');
  expect(url).toContain('utm_medium=affiliate');
  expect(url).toContain('utm_campaign=ai-tools');
  expect(url).toContain('utm_content=test-tool');
  expect(url).toContain('ref=vaultx');
}); 