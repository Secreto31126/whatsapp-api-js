const DEFAULT_API_VERSION = "v20.0";
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
export {
  ClientLimitedMessageComponent,
  ClientMessage,
  ContactComponent,
  ContactMultipleComponent,
  ContactUniqueComponent,
  DEFAULT_API_VERSION,
  Section
};
//# sourceMappingURL=types.js.map
