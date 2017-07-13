namespace VelocityStatic {
	export var data = new WeakMap<HTMLorSVGElement, ElementData>();
};

/**
 * Set or get internal data for an element
 */
function Data(element: HTMLorSVGElement): ElementData;
function Data(element: HTMLorSVGElement, value: ElementData): void;
function Data(element: HTMLorSVGElement, value?: ElementData): ElementData {
	if (value) {
		VelocityStatic.data.set(element, value);
	} else {
		return VelocityStatic.data.get(element);
	}
}
