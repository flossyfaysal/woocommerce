/**
 * External dependencies
 */
import { FrontendUtils } from '@woocommerce/e2e-utils';
import { Page } from '@playwright/test';

export class MiniCartUtils {
	private page: Page;

	constructor( page: Page ) {
		this.page = page;
	}

	async openMiniCart( frontendUtils: FrontendUtils ) {
		const block = await frontendUtils.getBlockByName(
			'woocommerce/mini-cart'
		);
		await block.click();
	}
}
