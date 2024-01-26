/**
 * External dependencies
 */
import { Page } from '@playwright/test';
import { Admin } from '@wordpress/e2e-test-utils-playwright';

export class ShippingUtils {
	private page: Page;

	constructor( page: Page ) {
		this.page = page;
	}

	async openShippingSettings( { admin }: { admin: Admin } ) {
		await admin.visitAdminPage(
			'admin.php',
			'page=wc-settings&tab=shipping&section=options'
		);
	}

	async enableShippingCalculator( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Enable the shipping calculator on the cart page' )
			.check();

		await this.saveShippingSettings( { page } );
	}

	async disableShippingCalculator( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Enable the shipping calculator on the cart page' )
			.uncheck();

		await this.saveShippingSettings( { page } );
	}

	async enableShippingCostsRequireAddress( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Hide shipping costs until an address is entered' )
			.check();

		await this.saveShippingSettings( { page } );
	}

	async disableShippingCostsRequireAddress( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Hide shipping costs until an address is entered' )
			.uncheck();

		await this.saveShippingSettings( { page } );
	}

	async saveShippingSettings( { page }: { page: Page } ) {
		await page.getByRole( 'button', { name: 'Save changes' } ).click();
	}
}
