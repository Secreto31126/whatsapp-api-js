const DEFAULT_API_VERSION = "v24.0";
class ClientMessage {
}
class ClientLimitedMessageComponent {
  /**
   * Throws an error if the array length is greater than the specified number.
   *
   * @param p - The parent component name
   * @param c - The component name
   * @param a - The array to check the length of
   * @param n - The maximum length
   * @throws `${p} can't have more than ${n} ${c}`
   */
  constructor(p, c, a, n) {
    if (a.length > n) {
      throw new Error(`${p} can't have more than ${n} ${c}`);
    }
  }
}
class Section extends ClientLimitedMessageComponent {
  /**
   * The title of the section
   */
  title;
  /**
   * Builds a section component
   *
   * @param name - The name of the section's type
   * @param keys_name - The name of the section's keys
   * @param elements - The elements of the section
   * @param max - The maximum number of elements in the section
   * @param title - The title of the section
   * @param title_length - The maximum length of the title
   * @throws If more than N elements are provided
   * @throws If title is over 24 characters if provided
   */
  constructor(name, keys_name, elements, max, title, title_length = 24) {
    super(name, keys_name, elements, max);
    if (title) {
      if (title.length > title_length) {
        throw new Error(
          `${name} title must be ${title_length} characters or less`
        );
      }
      this.title = title;
    }
  }
}
class ContactComponent {
  /**
   * @override
   * @internal
   */
  _build() {
    return this;
  }
}
class ContactMultipleComponent extends ContactComponent {
  /**
   * @override
   * @internal
   */
  get _many() {
    return true;
  }
}
class ContactUniqueComponent extends ContactComponent {
  /**
   * @override
   * @internal
   */
  get _many() {
    return false;
  }
}
class TemplateNamedParameter {
  /**
   * The name of the parameter, optional if using number variables
   */
  parameter_name;
  /**
   * @param parameter_name - The name of the parameter
   * @throws If parameter_name is over 20 characters or contains characters other than lowercase a-z and _
   */
  constructor(parameter_name) {
    if (!parameter_name) return;
    if (!/^[a-z_]{1,20}$/.test(parameter_name))
      throw new Error(
        "parameter_name can't be over 20 characters long and must contain only lowercase a-z and _"
      );
    this.parameter_name = parameter_name;
  }
}
export {
  ClientLimitedMessageComponent,
  ClientMessage,
  ContactComponent,
  ContactMultipleComponent,
  ContactUniqueComponent,
  DEFAULT_API_VERSION,
  Section,
  TemplateNamedParameter
};
//# sourceMappingURL=types.js.map
