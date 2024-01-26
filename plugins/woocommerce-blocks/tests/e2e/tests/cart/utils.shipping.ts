/**
 * External dependencies
 */
import { Page } from '@playwright/test';
import { Admin } from '@wordpress/e2e-test-utils-playwright';

export const utilsShipping = {
	openShippingSettings: async ( { admin }: { admin: Admin } ) => {
		await admin.visitAdminPage(
			'admin.php',
			'page=wc-settings&tab=shipping&section=options'
		);
	},

	enableShippingCalculator: async ( { page }: { page: Page } ) => {
		await page
			.getByLabel( 'Enable the shipping calculator on the cart page' )
			.check();

		await utilsShipping.saveShippingSettings( { page } );
	},

	disableShippingCalculator: async ( { page }: { page: Page } ) => {
		await page
			.getByLabel( 'Enable the shipping calculator on the cart page' )
			.uncheck();

		await utilsShipping.saveShippingSettings( { page } );
	},

	enableShippingCostsRequireAddress: async ( { page }: { page: Page } ) => {
		await page
			.getByLabel( 'Hide shipping costs until an address is entered' )
			.check();

		await utilsShipping.saveShippingSettings( { page } );
	},

	disableShippingCostsRequireAddress: async ( { page }: { page: Page } ) => {
		await page
			.getByLabel( 'Hide shipping costs until an address is entered' )
			.uncheck();

		await utilsShipping.saveShippingSettings( { page } );
	},

	saveShippingSettings: async ( { page }: { page: Page } ) => {
		await page.getByRole( 'button', { name: 'Save changes' } ).click();
	},
};
