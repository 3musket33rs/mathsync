//
//  DeserializedDifference.m
//  core
//
//  Created by Corinne Krych on 12/16/13.
//  Copyright (c) 2013 3musket33rs. All rights reserved.
//

#import "DeserializedDifference.h"
#import "Serialize.h"

@implementation DeserializedDifference
@synthesize added = _added;
@synthesize removed = _removed;

-(id)initWithSerializedDifference:(id<Difference>)serializedDifference deserializer:(id<Deserializer>)deserializer {
    if(self = [super init]) {
        _added = [self deserialize:serializedDifference.added with:deserializer];
        _removed = [self deserialize:serializedDifference.removed with:deserializer];
    }
    return self;
}


//=========================================================================================
// Private Methods
//=========================================================================================
-(NSSet*) deserialize:(NSSet*)serializedSet with:(id<Deserializer>)deserializer {
    NSMutableSet* buildingSet = [NSMutableSet set];
    for(NSData* content in serializedSet) {
        [buildingSet addObject:[deserializer deserialize:content]];
    }
    return [buildingSet copy];
}
@end
