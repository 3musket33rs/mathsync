//
//  DeserializedDifference.h
//  core
//
//  Created by Corinne Krych on 12/16/13.
//  Copyright (c) 2013 3musket33rs. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Difference.h"
#import "Serialize.h"

@interface DeserializedDifference : NSObject<Difference>
-(id)initWithSerializedDifference:(id<Difference>)difference deserializer:(id<Deserializer>)deserializer;
@end
