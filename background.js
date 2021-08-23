import 'webext-dynamic-content-scripts';
import addDomainPermissionToggle from 'webext-domain-permission-toggle';

// adds the "Enable Squashed Merge Message on this domain" menu item
// so the user can enable the extension on custom Github Enterprise domains
addDomainPermissionToggle();
