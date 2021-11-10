import objectHash from 'object-hash';

interface ExecItem {
    c: number; // action counter
    total?: number; // total actions
    scope?: string; // base name of action, scene, if, choice etc
    index?: number; // in choices, index of chosen scope
    origin?: number; // if inside interruption, which is the interrupting action
    // interrupting?: any;
}

export default class ExecStack {
    private execStack: ExecItem[]  = [];

    constructor(stack?: [{c: number,total: number,scope: string,index: number}]){
        if (stack){
            stack.forEach(item => {
                this.execStack.push(item)
            })
        }
    }

    shallowCopy(){
        // convert to list of objects for saving
        return this.execStack.map(item => {return {c:item.c, total: item.total, scope: item.scope, index:item.index, origin: item.origin} })
    }

    hash(): string {
        return objectHash(this.shallowCopy())
    }

    top(): ExecItem{
        // the current scope is at the top of the stack
        return this.execStack[0]
    }

    bottom(): ExecItem{
        return this.execStack[this.execStack.length-1]
    }

    clear(){
        this.execStack = []
    }

    replace(scope: string){
        // replace the whole stack, scope will be a new scene
        this.execStack = [{c:-1,scope:scope}]
    }

    stack(scope,total,index = -1, origin = -1){
        // stack a new scope, normally a branch but could be another scene
        this.execStack.unshift({c:-1, total: total, scope: scope, index: index, origin: origin});
    }

    advance(): void{
        // advance the counter on the top scope
        this.top().c++;
        // if counter is total, then this scope (scene, if or choice) is over
        if (this.top().c === this.top().total){
            this.execStack.shift();
            // shift also new top
            this.top().c++;
        }
        // if execStack is empty, game over
    }

    getActions(story): any[]{
        let stack = this.bottom()
        // find all action of the scene
        // scene name should be the bottom stack scope
        let allActions = [...story[stack.scope]];
        // get only actions after stack counter
        let actions = allActions.slice(stack.c);
        if(this.execStack.length !== 1){
            // there are some nested scopes
            for (let i = this.execStack.length-2;i>=0;i--){
                // nested scope should be the action at the counter
                let nestedScope = allActions[stack.c];
                stack = this.execStack[i];

                switch(stack.scope){
                    case 'interrupt':
                        // the nested scope will not be the last counter, but in the stack origin
                        nestedScope = allActions[stack.origin];
                        const int_op = Object.keys(nestedScope.interrupt[stack.index])[0]
                        allActions = nestedScope.interrupt[stack.index][int_op];
                        break;
                    case 'choice':
                        // find sub scope corresponding to index
                        const ch_op = Object.keys(nestedScope.choice[stack.index])[0]
                        allActions = nestedScope.choice[stack.index][ch_op];
                        break;
                    case 'if':
                        // if and else are their own only scope
                        const action = Object.keys(nestedScope)[0];
                        allActions = nestedScope[action];

                }
                const newActions = allActions.slice(stack.c);
                actions = newActions.concat(actions);
            }
        }
        return actions ? actions : [];
    }

}