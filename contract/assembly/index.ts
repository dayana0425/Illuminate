import { Context, logging, PersistentMap, u128, ContractPromiseBatch, PersistentSet } from 'near-sdk-as'

//Creation Storage
const Creations = new PersistentMap<string,string[]>("creation ideas");  // creator => creation
const AllCreationsVotes =  new PersistentMap<string,i32>("all creations"); // creation => votes
const AllCreations = new PersistentSet<string>("all creations"); // all creations ever submitted - for listing
const CreationsUserVotedFor = new PersistentMap<string, string[]>("creations votes for"); // userId => creations

// Entry Storage
const CreationToEntries = new PersistentMap<string, string[]>("Entries"); // cid => all text entries
const EntriesUserVotedFor = new PersistentMap<string, string[]>("entries voted for"); // userId => array of entries - for displaying in transactions 
const AllEntriesToVotes = new PersistentMap<string,i32>("all entry votes"); // eid => num votes

// Explore Page Storage
const illuminatedWorks = new PersistentSet<string>("illuminated works"); // cid => eid ... a full publication is one creation id that maps to a entry id

// Change Methods (incur a fee )(change state of blockchain)
export function publish(cid: string, eid:string):void {
    illuminatedWorks.add(cid + "," + eid);
}

// Adding an entry to an existing creation. 
// It's all based on id, the id is what is returned by IPFS since the actual content is stored in IPFS so the id is used to relocate the content.
export function addEntryToCreation(cid:string, eid:string):void{

    // Submitted Entries - Will be used for displaying in public view
    if(CreationToEntries.contains(cid)){
        let creationEntries = CreationToEntries.getSome(cid);
        creationEntries.push(eid);
        CreationToEntries.set(cid, creationEntries); 
    }
    else{
        CreationToEntries.set(cid, [eid])
    }

    // Adding Entry as a Voting recipient so that it can be voted for later
    AllEntriesToVotes.set(eid, 0);
    
    // Entries User has Voted For or Entries User has Submitted! - Will be used for displaying on the transaction page / based on who is logged it
    if(EntriesUserVotedFor.contains(Context.sender)){
        let userSubmittedEntries = EntriesUserVotedFor.getSome(cid);
        userSubmittedEntries.push(eid);
        EntriesUserVotedFor.set(Context.sender, userSubmittedEntries);
    }
    else{
        EntriesUserVotedFor.set(Context.sender, [eid]);
    }
}

// Mints new creations
export function addCreation(id:string):void {
    logging.log('adding creation');
    if (Creations.contains(Context.sender)){
        let senderCreations = Creations.getSome(Context.sender);
        senderCreations.push(id);
        Creations.set(Context.sender,senderCreations);
        
    } else {
        Creations.set(Context.sender,[id])
    }
    // add to ALL creations - since id's are all unique then I don't need to check if it exists in the map
    AllCreationsVotes.set(id, 0); // keeps track of votes for each creation
    AllCreations.add(id); // add to all creations to display to public
}

// handles votes by keeping track of votes for creations
export function handleVote(user:string, cid:string):void{
    AllCreationsVotes.set(cid, AllCreationsVotes.getSome(cid) + 1);
    if(CreationsUserVotedFor.contains(user)){
        let votedCreations = CreationsUserVotedFor.getSome(user);
        votedCreations.push(cid);
        CreationsUserVotedFor.set(user, votedCreations); 
    }
    else{
        CreationsUserVotedFor.set(user, [cid]); 
    }
}

// handles voting by keep track of votes for entries
export function handleEntryVote(user:string, eid:string):void {
    AllEntriesToVotes.set(eid, AllEntriesToVotes.getSome(eid) + 1);
    if(EntriesUserVotedFor.contains(user)){
        let votedEntries = EntriesUserVotedFor.getSome(user);
        votedEntries.push(eid);
        EntriesUserVotedFor.set(user, votedEntries);
    }
    else{
        EntriesUserVotedFor.set(user, [eid]);
    }
}

// handles transferring tokens to contract account
export function transferNearTokens(account:string,amount:u128):void{
    ContractPromiseBatch.create(account).transfer(amount);
    logging.log("success! Tokens Transfred to "+ account)
}

// View Methods
export function getIlluminatedWorks():string[]{
    return illuminatedWorks.values();
}

export function getEntries(cid:string):string[]{
    logging.log('returning entries given: ' + cid); // return all entries give the creation id
    return CreationToEntries.getSome(cid);
}

export function getAllCreationVotes(cid:string):i32{
    logging.log(cid + " was voted for");
    return AllCreationsVotes.getSome(cid);
}

export function getAllEntryVotes(eid:string):i32{
    if(AllEntriesToVotes.contains(eid)){
        return AllEntriesToVotes.getSome(eid);
    }
    return 0;
}

export function getAllVotedForCreations(user:string):string[]{
    return CreationsUserVotedFor.getSome(user);
}

export function getAllVotedForEntries(user:string):string[]{
    return EntriesUserVotedFor.getSome(user);
}

export function getAllCreations():string[]{
    return AllCreations.values();
}

export function getCreations(user:string):string[]{
    if(Creations.contains(user)){
        return Creations.getSome(user);
    } else{
        return[];
    }
}
