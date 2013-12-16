//
//  Serialize.h
//  core
//
//  Created by Corinne Krych on 12/16/13.
//  Copyright (c) 2013 3musket33rs. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol Serializer <NSObject>
-(NSData*)serialize:(id)item;
@end

@protocol Deserializer <NSObject>
-(id)deserialize:(NSData*)data;
@end
