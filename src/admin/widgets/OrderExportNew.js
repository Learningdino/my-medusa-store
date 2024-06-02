import { useState } from "react";

const csvHeader = [
	"Order id",
	"Invoice number",
	"Invoice Date",
	"Order Status",
	"Fullfilment Status",
	"Payment Mode",
	"Customer Id",
	"Customer First Name",
	"Customer Last Name",
	"Customer Email",
	"Customer Phone",
	"Billing Address",
	"Pincode",
	"Billing City",
	"Billing State",
	"Billing Country",
	"GSTIN",
	"Item Code",
	"Item description",
	"Item Unit Price",
	"Item Quantity",
	"Total Unit Price",
	"Tax Rate",
	"Actual Item Amount",
	"Discount %",
	"Discount Code",
	"Discount Value",
	"Actual Item Amount After Discount",
	"CGST",
	"SGST",
	"IGST",
	"CGST Value",
	"SGST Value",
	"IGST Value",
	"Actual Item Amount After Discount After Tax",
	"Shipping Charges",
	"Shipping CGST",
	"Shipping SGST",
	"Shipping IGST",
	"Shipping CGST Value",
	"Shipping SGST Value",
	"Shipping IGST Value",
	"Shipping Tax Rate",
	"Total Product Value",
	"Total Product Tax Value",
	"Total Invoice Value",
	"Total Invoice Tax Value",
	"Place of Supply",
	"State of Supply",
	"HSN Code",
];

function extractFields(data) {
	const customerFirstName = data?.customer?.first_name || data?.shipping_address?.first_name || "N/A";
	const customerLastName = data?.customer?.last_name || data?.shipping_address?.last_name || "N/A";

	const invoiceNumber = `inv-${(data?.orderIndex +1)?.toString().padStart(5, '0')}`
	const isCOD = data?.payments?.[0]?.provider_id === 'cod';
	const paymentStatus = data?.payment_status || '';
	const orderStatus = (paymentStatus == 'captured' || isCOD) ? 'Confirmed' : 'Pending';
	const paymentMode = isCOD ? 'COD' : 'Prepaid';

	const customerId = data?.customer?.id || '';
	const customerPhone = data?.customer?.phone || data?.shipping_address?.phone || '';
	const billingAddress = `${data?.billing_address?.address_1 || ''} ${" "} ${data?.billing_address?.address_2 || ''}`;
	const customerEmail = data?.email || data?.customer?.email || "N/A";
	const billingState = data?.billing_address?.province || data?.shipping_address?.province || '';
	const billingCountry = data?.billing_address?.country_code || '';
	const billingCity = data?.billing_address?.city || '';

	const discountCode = data?.discounts?.[0]?.code || '';
	const discountRate = data?.discounts?.[0]?.rule?.value ? `${data?.discounts?.[0]?.rule?.value || ''} %` : '';
	const itemDiscountTotal = data?.items?.[0]?.discount_total / 100 || 0;

	const itemTaxRate = data?.items?.[0]?.tax_lines?.[0]?.rate || 0;

	const itemSKU = data?.items?.[0]?.variant?.sku || '';
	const itemDescription = data?.items?.[0]?.title || '';
	const itemQuantity = data?.items?.[0]?.quantity || 0;

	const itemUnitPrice = (data?.items?.[0]?.unit_price / 100) || 0;
	const itemTotalUnitPrice = (data?.items?.[0]?.unit_price * itemQuantity) / 100 || 0;
	const itemActualAmount = (data?.items?.[0]?.subtotal / 100) || 0;	
	const itemAmountAfterDiscount = (data?.items?.[0]?.subtotal - data?.items?.[0]?.discount_total) / 100 || 0;
	const itemAmountAfterDiscountAfterTax = (data?.items?.[0]?.total / 100) || 0;
		
	// const itemBasePrice = ((data?.items?.[0]?.unit_price)/(1 + itemTaxRate/100)) / 100 || 0;
	// const itemBaseDiscountedPrice = (itemBasePrice - itemDiscountTotal) || 0;

	const itemPriceWithTax = (data?.items?.[0]?.total / 100) || 0;
	const itemPriceWithoutTax = (data?.items?.[0]?.subtotal - data?.items?.[0]?.discount_total) / 100 || 0;
	// const itemPriceWithoutTax = itemBaseDiscountedPrice;
	// const itemPriceWithTax = itemBaseDiscountedPrice + (itemBaseDiscountedPrice * (itemTaxRate/100)) || 0;
	// const itemPriceWithTax = (data?.items?.[0]?.original_total || 0) / 100 || '';
	// const itemPriceWithoutTax = (data?.items?.[0]?.unit_price || 0) / 100 || '';

	const shippingState = data?.shipping_address?.province || '';
	const isIGSTApplicable = shippingState?.toLowerCase() === 'karnataka';

	
	const itemCGSTRate = itemTaxRate / 2 || 0;
	const itemSGSTRate = isIGSTApplicable ? 0 : (itemTaxRate / 2 || 0);
	const itemIGSTRate = isIGSTApplicable ? (itemTaxRate / 2 || 0) : 0;
	const itemCGSTValue = ((itemPriceWithoutTax * itemCGSTRate) / 100) || 0;
	const itemSGSTValue = ((itemPriceWithoutTax * itemSGSTRate) / 100) || 0;
	const itemIGSTValue = ((itemPriceWithoutTax * itemIGSTRate) / 100) || 0;
	// Shipping
	const shippingCharges = data?.shipping_methods?.[0]?.subtotal / 100 || 0;
	const shippingTaxRate = data?.shipping_methods?.[0]?.tax_lines?.[0]?.rate || 0;
	const shippingCGSTRate = shippingTaxRate / 2 || 0;
	const shippingSGSTRate = isIGSTApplicable ? 0 : (shippingTaxRate / 2 || 0);
	const shippingIGSTRate = isIGSTApplicable ? (shippingTaxRate / 2 || 0) : 0;
	const shippingCGSTValue = ((shippingCharges * shippingCGSTRate) / 100) || 0;
	const shippingSGSTValue = ((shippingCharges * shippingSGSTRate) / 100) || 0;
	const shippingIGSTValue = ((shippingCharges * shippingIGSTRate) / 100) || 0;

	const totalProductValue = data?.items?.[0]?.total / 100 || 0;
	const totalProductTaxValue = data?.items?.[0]?.tax_total / 100 || 0;

	const totalInvoiceValue = data?.total / 100 || 0;
	const totalInvoiceTaxValue = (data?.tax_total / 100) || 0;

	const placeOfSupply = 'Bangalore';
	const stateOfSupply = 'Karnataka';

	const HSNCode = data?.items?.[0]?.variant?.hs_code || '';

	const newdata = [
		data?.display_id || "N/A",
		invoiceNumber || "",
		data?.created_at || "N/A",
		orderStatus,
		data?.fulfillment_status || "N/A",
		paymentMode,
		customerId,
		customerFirstName,
		customerLastName,
		customerEmail,
		customerPhone,
		billingAddress,
		data?.billing_address?.postal_code,
		billingCity,
		billingState,
		billingCountry,
		"GSTIN",
		itemSKU,
		itemDescription,
		itemUnitPrice,
		itemQuantity,
		(itemTotalUnitPrice).toFixed(2),
		itemTaxRate,
		(itemActualAmount).toFixed(2),
		discountRate,
		discountCode,
		(itemDiscountTotal).toFixed(2),
		(itemAmountAfterDiscount).toFixed(2),
		itemCGSTRate,
		itemSGSTRate,
		itemIGSTRate,
		(itemCGSTValue).toFixed(2),
		(itemSGSTValue).toFixed(2),
		(itemIGSTValue).toFixed(2),
		(itemAmountAfterDiscountAfterTax).toFixed(2),
		(shippingCharges).toFixed(2),
		shippingCGSTRate,
		shippingSGSTRate,
		shippingIGSTRate,
		(shippingCGSTValue).toFixed(2),
		(shippingSGSTValue).toFixed(2),
		(shippingIGSTValue).toFixed(2),
		shippingTaxRate,
		(totalProductValue).toFixed(2),
		(totalProductTaxValue).toFixed(2),
		(totalInvoiceValue).toFixed(2),
		(totalInvoiceTaxValue).toFixed(2),
		placeOfSupply,
		stateOfSupply,
		HSNCode,
	];
	for (let i = 0; i < newdata.length; i++) {
		const data = newdata[i];
		if (data && typeof data === "string") {
			newdata[i] = data.replaceAll(",", " ");
		}
	}

	return newdata;
}

function convertToCSV(header, dataArray) {
	const headerRow = header.join(",") + "\n";
	const dataRows = dataArray.map((data) => data.join(",")).join("\n");
	return headerRow + dataRows;
}

const getAllCarts = async ({ startDate, endDate }) => {
	let query = "";
	if (startDate) {
		query = `${query}&created_at[gte]=${startDate}`;
	}
	if (endDate) {
		query = `${query}&created_at[lte]=${endDate}`;
	}
	try {
		const response = await fetch(
			`${process.env.MEDUSA_BACKEND_URL}/admin/orders?limit=&fields=id,display_id,status,created_at,shipping_total,discount_total,tax_total,refunded_total,total,subtotal,paid_total,refundable_amount,currency_code,customer_id,email,fulfillment_status,payment_status${query}`,
			{
				credentials: "include",
			}
		);
		if (!response.ok) return;
		const jsonData = await response.json();

		return jsonData;
	} catch (error) {
		console.log(error);
	}
};

const OrderExport = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const handleDownload = async () => {
		const { orders } = await getAllCarts({ startDate, endDate });

		// generate orders for each items separately
		const formattedOrdes = [];
		orders?.reverse()?.forEach((order, orderIndex) => {
			order.items.forEach(item => {
				const duplicatedOrder = Object.assign({}, order); // Clone order
				duplicatedOrder.orderIndex = orderIndex;
				duplicatedOrder.items = [item]; // Only include the current item
				formattedOrdes.push(duplicatedOrder);
			});
		});

		const flattenedDataArray = formattedOrdes.map((data) => extractFields(data));

		const csvData = convertToCSV(csvHeader, flattenedDataArray);

		const blob = new Blob([csvData], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(blob);
		link.download = "data.csv";
		link.click();
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
	};

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
	};

	return (
		<div className="flex gap-4 items-center">
			<div className="flex gap-2 items-center">
				<input
					type="date"
					name="startDate"
					className="bg-white py-2 px-4 rounded-lg border font-bold"
					placeholder="Start Date"
					onChange={handleStartDateChange}
				/>
				<span>-</span>
				<input
					type="date"
					name="endDate"
					className="bg-white py-2 px-4 rounded-lg border font-bold"
					placeholder="End Date"
					onChange={handleEndDateChange}
				/>
			</div>
			<button
				type="button"
				className="bg-white py-2 px-4 rounded-lg border font-bold"
				onClick={handleDownload}
			>
				Export Orders
			</button>
		</div>
	);
};

export const config = {
	zone: "order.list.before",
};

export default OrderExport;