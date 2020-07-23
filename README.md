# Team Filters Plugin for Twilio Flex
The Team Filters Plugin allows you to customize the filtering of agents in the Teams View of [Twilio Flex](https://www.twilio.com/flex).

The technique being used by this plugin is documented [here](https://www.twilio.com/docs/flex/ui/using-team-view-filters) and enabled starting with Flex 1.18.

Out of the box, Flex supports filtering of agents by their current Activity. This plugin adds filtering by team name and by routing skill. However, with minor changes to this code you can modify the actual set of filters made available to supervisory users.

## Install
Make sure you have [`Node.js`](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Install the dependencies:

```bash
cd plugin-team-filters
```
If you use npm:
```
npm install
```

## Configure
This plugin demonstrates two ways to populate the option values for a filter. With both, values are stored in the Flex Service configuration. Access and use of this configuration data can be seen in the code (src/TeamFiltersPlugin.js). The filter option values are then compared against corresponding Worker attributes to filter the list of agents. Of course, you may have other ways of storing the option values for your required filters. You may even want to hard-code the values for a filter that is static.

### Filter by Agent Skill
The sample `Skills` filter is populated from the list of Flex-administered skills. Use of this filter requires the customer to use the skills administration capability.

### Filter by Team Name
The sample `Teams` filter gets its values from a list of team names stored in a custom Flex configuration property. It presumes that each agent has a `team` property in the Worker attributes. Adjust the filter definition and options configuration data to match your specific agent search criteria.

Emerging best practice is to store custom configuration data needed by a plugin at `attributes.<plugin-namespace>` using the Flex API endpoint at /Configuration. This plugin uses the `team_filters` plugin namespace.

NOTE: when setting any `attributes` subkey, you will want to preserve properties stored for other plugins under other subkeys. As explained in the documentation on [modifying configuration for flex.twilio.com](https://www.twilio.com/docs/flex/ui-configuration-customization#modifying-configuration-for-flextwiliocom), you should retrieve all data at the configuration key (in this case it's `attributes`), edit the data under your subkey, and then `POST` back the edited data for the parent key. In `public/teams.json` you will see an example of the JSON that might be edited into the data you post back to the `attributes` key.

The plugin retrieves team names stored like so:
```
  attributes: {
    ...,
    team_filters: {
      team_names: ['Red', 'White', 'Blue', 'Green']
    }
  }
```

## Develop
In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:3000`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

NOTE: the plugin requires configuration before it will load and function correctly.

## Deploy
Once you are happy with your plugin, you have to bundle it, in order to deploy it to the Twilio cloud.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin: `plugin-team-filters.js`. One way to deploy the plugin is to upload this file into the Assets part of your Twilio Runtime.
