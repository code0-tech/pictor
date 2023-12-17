import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner'
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

const prepareA11y = async (page) => await injectAxe(page);

const executeA11y = async (page, context) => {
  // Get the entire context of a story, including parameters, args, argTypes, etc.
  const storyContext = await getStoryContext(page, context);

  // Do not run a11y tests on disabled stories.
  if (storyContext.parameters?.a11y?.disable) {
    return;
  }

  // Apply story-level a11y rules
  await configureAxe(page, {
    rules: storyContext.parameters?.a11y?.config?.rules,
  });

  await checkA11y(page, '#storybook-root', {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
    verbose: false,
  });
}

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    await waitForPageReady(page);
    await prepareA11y(page);
    await executeA11y(page, context);
  },
};

export default config;
