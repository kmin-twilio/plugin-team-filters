import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'TeamFiltersPlugin';

// function for sorting workers displayed in the table
const sortWorkersByFullname = (worker1, worker2) =>
  (worker1.attributes.full_name < worker2.attributes.full_name) ? -1 : 1;

// mapper functions used to create agent filter options
const teamToOption = (team) => ({value: team, label: team, default: false});
const skillToOption = (skill) => ({value: skill.name, label: skill.name, default: false});

export default class TeamFiltersPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    const {serviceConfiguration} = manager;
    flex.TeamsView.defaultProps.filtersEnabled = true;
    flex.WorkersDataTable.defaultProps.initialCompareFunction = sortWorkersByFullname;

    const pluginConfig = serviceConfiguration.attributes.team_filters;
    if (! pluginConfig) {
      console.error(`${PLUGIN_NAME}: plugin not configured! see README for instructions`);
      return;
    }

    /*
      Create additional agent filters.
      The filter 'id' contains the worker attributes path.
      The 'condition' should always be "IN".
    */

    // create filter based on team names
    const teamOptions = pluginConfig.team_names.map(teamToOption);
    const teamFilter = {
      id: "data.attributes.team",
      fieldName: "team",
      title: "Teams",
      type: Flex.FiltersListItemType.multiValue,
      options: teamOptions,
      condition: "IN"
   };
   
    // create filter based on Flex skills
    const skillOptions = serviceConfiguration.taskrouter_skills.map(skillToOption);
    const skillFilter = {
      id: "data.attributes.routing.skills",
      fieldName: "skills",
      title: "Skills",
      type: Flex.FiltersListItemType.multiValue,
      options: skillOptions,
      condition: "IN"
   };

  flex.TeamsView.defaultProps.filters = [
    flex.TeamsView.activitiesFilter,
    teamFilter,
    skillFilter
  ];
 }
}
