//
//  Difference.h
//  core
//
//  Created by Corinne Krych on 12/16/13.
//  Copyright (c) 2013 3musket33rs. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol Difference
@property (nonatomic, strong) NSSet* added;
@property (nonatomic, strong) NSSet* removed;
@end