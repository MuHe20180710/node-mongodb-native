import { checkCollectionName, Callback } from '../utils';
import { loadCollection } from '../dynamic_loaders';
import { RunAdminCommandOperation } from './run_command';
import { defineAspects, Aspect } from './operation';
import type { Server } from '../sdam/server';
import type { Collection } from '../collection';
import type { CommandOperationOptions } from './command';
import { MongoError } from '../error';

/** @public */
export interface RenameOptions extends CommandOperationOptions {
  /** Drop the target name collection if it previously exists. */
  dropTarget?: boolean;
  /** Unclear */
  new_collection?: boolean;
}

/** @internal */
export class RenameOperation extends RunAdminCommandOperation {
  collection: Collection;
  newName: string;

  constructor(collection: Collection, newName: string, options: RenameOptions) {
    // Check the collection name
    checkCollectionName(newName);

    // Build the command
    const renameCollection = collection.namespace;
    const toCollection = collection.s.namespace.withCollection(newName).toString();
    const dropTarget = typeof options.dropTarget === 'boolean' ? options.dropTarget : false;
    const cmd = { renameCollection: renameCollection, to: toCollection, dropTarget: dropTarget };
    super(collection, cmd, options);

    this.collection = collection;
    this.newName = newName;
  }

  execute(server: Server, callback: Callback<Collection>): void {
    const Collection = loadCollection();
    const coll = this.collection;

    super.execute(server, (err, doc) => {
      if (err) return callback(err);
      // We have an error
      if (doc.errmsg) {
        return callback(new MongoError(doc));
      }

      try {
        return callback(undefined, new Collection(coll.s.db, this.newName, coll.s.options));
      } catch (err) {
        return callback(new MongoError(err));
      }
    });
  }
}

defineAspects(RenameOperation, [Aspect.WRITE_OPERATION]);
