import { forEach } from "cypress/types/lodash";
import { TNetwork } from "src/pages/home/Network/NetworkLibrary";

export interface FilterFunction {
    (value) : boolean;
};

export interface Filter {
    filterFunction : FilterFunction;
    filterName : string;
    filterParam: string;
}

export interface Taggable {
    filterTags : Set<string>,
    object : any,
}



export class Filterer {

    filters: Map<string, Filter>;
    theList: Array<TNetwork>
    theFilteredList: Array<TNetwork>;
 
    constructor(listToFilter : Array<TNetwork>) {
        this.filters = new Map();
        this.theList = listToFilter?? [];
        this.theFilteredList = listToFilter ?? [];
    }

    /**
     * 
     * @returns filters used
     */
    getFilters() {
        return this.filters;
    }

    /**
     * Add filter by unique name.
     * @param {string} filterName 
     * @param {function} filter 
     */
    addFilter(filterName, filter : Filter) {
        if(this.filters.has(filterName)) {
            console.log("Filter with this name already exists " + filterName);
            return false;
        }
        this.filters.set(filterName, filter);
        this.filterList()
        return true;
    }


    /**
     * Remove filter by name.
     * @param {string} filterName 
     */
    removeFilter(filterName) {
        if(!this.filters.has(filterName)) {
            console.log("Filter with this name does not exist " + filterName);
            return false;
        }
        this.filters.delete(filterName);
        this.filterList()
        return true;
    }

    clearFilters() {
        this.filters.clear();
        this.theFilteredList = this.theList;
        return true;
    }


    /**
     * 
     * @returns The remaining items in the list which have met all filtering requirements
     */
    getFilteredList() {
        return this.theFilteredList;
    }

    // /**
    //  * Add an item to be filtered
    //  * @param {*} item 
    //  */
    // addToList(item) {
    //     let tags = new Set();
    //     this.filters.forEach((filter, filterName) => {
    //         if(!filter(item)) {
    //             tags.add(filterName);
    //         }
    //     });
    //     this.theList.push({filterTags:tags,object:item});
    // }

    // /**
    //  * Remove an item from the to be filtered list
    //  * @param {*} item 
    //  */
    // removeFromList(item) {
    //     this.theList = this.theList.filter(elt => {
    //         return elt.object !== item;
    //     });
    // }

    //filters the list down
    filterList() {
        this.theFilteredList = [];
        this.theList.forEach((network) => {
            let filteredNetwork = {...network, platforms: []}
            network.platforms.forEach((platform) => {
                let filteredPlatform = {...platform, services: []}
                platform.services.forEach((service) => {
                    let isGood = true;
                    this.filters.forEach((f) => {
                        if(!isGood) return;
                        isGood = f.filterFunction(service);
                    });
                    isGood && filteredPlatform.services.push(service);
                })
                if(filteredPlatform.services.length > 0){
                    filteredNetwork.platforms.push(filteredPlatform);
                }
            })
            if(filteredNetwork.platforms.length > 0){
                this.theFilteredList.push(filteredNetwork);
            }
        })
    }

}
